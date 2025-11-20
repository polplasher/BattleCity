//para probar si funciona el sistema de vidas y explosion
import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankBasic extends BaseEnemy {
    constructor(scene, x, y) {
        const key = 'enemy_tank';
        const health = ENEMY.DEFAULT_HEALTH;

        super(scene, x, y, key, health);

        // Aquí se podrá poner su velocidad, IA, etc.
        this.speed = ENEMY.SPEED;
        
        this.body.setAllowGravity(false);
        this.direction = -1;
        this.setImmovable(true);

        this.start = true;

        this.bulletManager = null;
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);

        this.createAnimations();
    }

    setBulletManager(manager) {
        this.bulletManager = manager;
    }

    reset(x, y) {
        super.reset(x, y);
        this.start = true;
        this.direction = -1;
    }

    createAnimations() {
        // Solo crear si no existen (para múltiples instancias)
        if (this.scene.anims.exists('enemy_up')) return;

        const animConfigs = [
            { key: 'enemy_up', start: 0, end: 1 },
            { key: 'enemy_left', start: 2, end: 3 },
            { key: 'enemy_down', start: 4, end: 5 },
            { key: 'enemy_right', start: 6, end: 7 }
        ];

        animConfigs.forEach(config => {
            this.scene.anims.create({
                key: config.key,
                frames: this.scene.anims.generateFrameNumbers('enemy_tank',
                    { start: config.start, end: config.end }
                ),
                frameRate: 8,
                repeat: -1
            });
        });
    }

    colisionHandler()
    {
        if (this.body.blocked.left || this.body.blocked.right||this.body.blocked.up || this.body.blocked.down)
        {
            

                if (Math.random() < 0.5 )  
                {
                    console.log("Cambio Horizontal");
                    this.body.setVelocity(this.speed * this.direction,0);
                    if (this.direction === 1)
                    {
                        this.anims.play('enemy_right', true);
                    }else
                    {
                        this.anims.play('enemy_left', true);
                    }
                }else
                {
                    console.log("Cambio Vertical");
                    if (Math.random() < 0.5 )  
                    {
                        this.direction = -1;
                        this.anims.play('enemy_up', true);
                    }else
                    {
                        this.direction = 1;
                        this.anims.play('enemy_down', true);
                    }
                    this.body.setVelocity(0, this.speed * this.direction);

        }

        
            
        }
    }

    shoot() {
        if (!this.bulletManager || !this.active) return;

        let vx = 0;
        let vy = 0;
        const bSpeed = ENEMY.BULLET_SPEED;

        if (this.body.velocity.x > 0) vx = bSpeed;
        else if (this.body.velocity.x < 0) vx = -bSpeed;
        
        if (this.body.velocity.y > 0) vy = bSpeed;
        else if (this.body.velocity.y < 0) vy = -bSpeed;

        if (vx === 0 && vy === 0) {
             vy = -bSpeed; 
        }

        this.bulletManager.fire(this.x, this.y, vx, vy);
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time,delta);
        if (this.start === true) {
            this.body.setVelocity(0,this.speed * this.direction);
            this.anims.play('enemy_up', true);
            this.start = false;
        }
        this.colisionHandler();

        this.shootTimer -= delta;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
        }
    } 
}

export { TankBasic };