import { PLAYER } from '../../core/constants.js';
import { EVENTS } from '../../core/events.js';
import { Bullet } from './Bullet.js';

class Player extends Phaser.Physics.Arcade.Sprite {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('tank', 'tanks/yellow/tank1_yellow.png', { frameWidth: 16, frameHeight: 16 });

        scene.load.setPath('assets/audio');
        scene.load.audio('tank_movement_sound', 'Battle City SFX (16).wav');
        scene.load.audio('explosion_sound', 'Battle City SFX (7).wav');
    }

    constructor(scene, x, y, key = 'player') {
        super(scene, x, y, key, 4);

        // Añadir a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Make the physical hitbox smaller than the 16x16 sprite and center it
        if (this.body) {
            this.body.setSize(10, 10);
            this.body.setOffset(2, 2);
        }

        // Propiedades del player
        this.facing = 'down';
        this.lastShot = 0;
        this.speed = PLAYER.SPEED;
        this.scene = scene;
        this.setCollideWorldBounds(true);

        this.BULLET_FRAMES = { up: 0, left: 1, down: 2, right: 3 };
        this.sound = false;
        this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE');

        this.isInvulnerable = false;
        this.shieldVisual = null;

        this.createAnimations();
    }

    activateShield(duration = 10000) {
        if (this.isInvulnerable && this.shieldTimer) {
            this.shieldTimer.remove();
        }

        this.isInvulnerable = true;

        if (!this.shieldVisual) {
            this.shieldVisual = this.scene.add.graphics();
        }

        this.shieldTimer = this.scene.time.delayedCall(duration, () => {
            this.isInvulnerable = false;
            if (this.shieldVisual) this.shieldVisual.clear();
        });
    }

    takeDamage() {
        if (this.isInvulnerable) return;

        this.scene.events.emit(EVENTS.PLAYER_DAMAGED);
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.handleMovement();

        // Disparo
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.shoot();
        }

        if (this.isInvulnerable && this.shieldVisual) {
            this.shieldVisual.clear();
            const color = Math.floor(time / 100) % 2 === 0 ? 0xffffff : 0x555555;
            this.shieldVisual.lineStyle(2, color);
            this.shieldVisual.strokeRect(this.x - 9, this.y - 9, 18, 18);
        }
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
            this.setFrame({ up: 0, left: 2, down: 4, right: 6 }[this.facing]);

            // Stop movement sound when not moving
            if (this.sound) {
                this.scene.sound.stopByKey('tank_movement_sound');
                this.sound = false;
            }
        }

        // Play movement sound when moving (only if not already playing)
        if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0) && !this.sound) {
            this.scene.sound.play('tank_movement_sound', { loop: true });
            this.sound = true;
        }
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
            this.createBulletFromPool(vx, vy);
        }
    }

    canShoot() {
        const bulletPool = this.scene.bulletPool;

        if (!bulletPool) return false;

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

        if (!bulletPool) return;

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