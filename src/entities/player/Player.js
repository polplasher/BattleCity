
import { PLAYER } from '../../core/constants.js';


class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key = 'player') {
        super(scene, x, y, key, 4);

        // Añadir a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Propiedades del player
        this.facing = 'down';
        this.lastShot = 0;
        this.speed = PLAYER.SPEED;
        this.scene = scene;
        this.setCollideWorldBounds(true);

        this.BULLET_FRAMES = { up: 0, left: 1, down: 2, right: 3 };

        this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE');
        this.createAnimations();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.handleMovement();

        // Disparo
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.shoot();
        }
        this.tank_sound = this.scene.sound.add('tank_movement_sound');
    }

    createAnimations() {
        // Solo crear si no existen (para múltiples instancias)
        if (this.scene.anims.exists('tank_up')) return;

        const animConfigs = [
            { key: 'tank_up', start: 0, end: 1 },
            { key: 'tank_left', start: 2, end: 3 },
            { key: 'tank_down', start: 4, end: 5 },
            { key: 'tank_right', start: 6, end: 7 }
        ];

        animConfigs.forEach(config => {
            this.scene.anims.create({
                key: config.key,
                frames: this.scene.anims.generateFrameNumbers('tank',
                    { start: config.start, end: config.end }
                ),
                frameRate: PLAYER.FRAME_RATE,
                repeat: -1
            });
        });
    }

    handleMovement() {
        this.setVelocity(0, 0);

        
            
        if (this.keys.D.isDown) {
            
            this.setVelocityX(this.speed);
            this.anims.play('tank_right', true);
            this.facing = 'right';
        } else if (this.keys.A.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play('tank_left', true);
            this.facing = 'left';
        } else if (this.keys.W.isDown) {
            this.setVelocityY(-this.speed);
            this.anims.play('tank_up', true);
            this.facing = 'up';
        } else if (this.keys.S.isDown) {
            this.setVelocityY(this.speed);
            this.anims.play('tank_down', true);
            this.facing = 'down';
        } else {
            this.anims.stop();
            this.scene.sound.stopByKey('tank_movement_sound');
            this.setFrame({ up: 0, left: 2, down: 4, right: 6 }[this.facing]);
        }
        if (this.velocity != 0)
            this.scene.sound.play("tank_movement_sound");
    }

    shoot() {
        // Validar límites y cooldown
        if (!this.canShoot()) return;

        this.lastShot = this.scene.time.now;

        // Calcular posición y velocidad
        const { vx, vy } = this.getBulletSpawnData();
        const frame = this.BULLET_FRAMES[this.facing];

        // Usar BulletManager si existe, sino pooling manual
        if (this.scene.bulletManager) {
            this.scene.bulletManager.fire(this.x, this.y, vx, vy, frame);
        } else {
            this.createBulletFromPool(vx, vy,);
        }
    }

    canShoot() {
        const bulletPool = this.scene.bulletPool;
        const activeCount = bulletPool.getMatching('active', true).length;

        if (activeCount >= PLAYER.MAX_BULLETS) return false;

        const now = this.scene.time.now;
        if (now - this.lastShot < PLAYER.FIRE_COOLDOWN) return false;

        return true;
    }

    getBulletSpawnData() {
        const speed = PLAYER.BULLET_SPEED;

        const velocities = {
            up: { vx: 0, vy: -speed },
            down: { vx: 0, vy: speed },
            left: { vx: -speed, vy: 0 },
            right: { vx: speed, vy: 0 }
        };

        const velocity = velocities[this.facing];
        return { vx: velocity.vx, vy: velocity.vy };
    }

    createBulletFromPool(vx, vy) {
        const bulletPool = this.scene.bulletPool;

        let bullet = bulletPool.getFirst(false);
        if (!bullet) {
            bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
            bulletPool.add(bullet);
        } else {
            bullet.setActive(true).setVisible(true);
            bullet.body.reset(this.x, this.y);
        }

        bullet.setFrame(0).setOrigin(0.5, 0.5);
        if (bullet.body) {
            bullet.body.setAllowGravity(false);
            bullet.body.setSize(4, 4, true);
            bullet.body.setVelocity(vx, vy);
        }
    }
}

export { Player };