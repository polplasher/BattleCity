import { ENEMY } from '../../core/constants.js';
import { EVENTS } from '../../core/events.js';

class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, health, points, speed, bulletSpeed) {
        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);

        
        this.health = health;
        this.maxHealth = health;
        this.points = points;
        this.moveSpeed = speed;
        this.bulletSpeed = bulletSpeed;
        
       
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.setImmovable(true); 

        
        this.direction = -1; 
        this.start = true;
        this.bulletManager = null;
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);

        
        this.createAnimations(textureKey);
        
       
        this.onHealthChanged();
    }

    setBulletManager(manager) {
        this.bulletManager = manager;
    }

    

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        
        if (this.start) {
            this.body.setVelocity(0, this.moveSpeed * this.direction);
            this.playAnimation('up');
            this.start = false;
        }

        this.colisionHandler();

        
        this.shootTimer -= delta;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
        }
    }

    colisionHandler() {
        if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down) {
           
            if (Math.random() < 0.5) {
                
                this.body.setVelocity(this.moveSpeed * this.direction, 0);
                if (this.direction === 1) this.playAnimation('right');
                else this.playAnimation('left');
            } else {
               
                this.direction = Math.random() < 0.5 ? -1 : 1;
                
                this.body.setVelocity(0, this.moveSpeed * this.direction);
                if (this.direction === 1) this.playAnimation('down');
                else this.playAnimation('up');
            }
        }
    }

    shoot() {
        if (!this.bulletManager || !this.active) return;

        let vx = 0;
        let vy = 0;
        const bSpeed = this.bulletSpeed;

       
        if (this.body.velocity.x > 0) vx = bSpeed;
        else if (this.body.velocity.x < 0) vx = -bSpeed;
        else if (this.body.velocity.y > 0) vy = bSpeed;
        else if (this.body.velocity.y < 0) vy = -bSpeed;
        else vy = bSpeed; 

        this.bulletManager.fire(this.x, this.y, vx, vy);
    }

   

    createAnimations(textureKey) {
        
        if (this.scene.anims.exists(textureKey + '_up')) return;

        const animConfigs = [
            { suffix: '_up', start: 0, end: 1 },
            { suffix: '_left', start: 2, end: 3 },
            { suffix: '_down', start: 4, end: 5 },
            { suffix: '_right', start: 6, end: 7 }
        ];

        animConfigs.forEach(config => {
            this.scene.anims.create({
                key: textureKey + config.suffix,
                frames: this.scene.anims.generateFrameNumbers(textureKey, { start: config.start, end: config.end }),
                frameRate: 8,
                repeat: -1
            });
        });
    }

    playAnimation(direction) {
       
        this.anims.play(this.texture.key + '_' + direction, true);
    }

    

    takeDamage(amount = 1) {
        this.health -= amount;
        this.onHealthChanged();

        if (this.health <= 0) {
            this.die();
        }
    }

    // por ArmorTank
    onHealthChanged() {}

    die() {
        this.scene.events.emit(EVENTS.ENEMY_DIED, { x: this.x, y: this.y, points: this.points });
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });

        this.setActive(false);
        this.setVisible(false);
        if (this.body) this.body.reset(-500, -500);
    }

    reset(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(x, y);
        this.health = this.maxHealth;
        this.start = true; 
        this.clearTint();
        this.onHealthChanged();
    }
}

export { BaseEnemy };