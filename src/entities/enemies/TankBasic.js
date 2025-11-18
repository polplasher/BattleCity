//para probar si funciona el sistema de vidas y explosion
import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';
import { EnemyManager } from '../../managers/EnemyManager.js';

class TankBasic extends BaseEnemy {
    constructor(scene, x, y) {
        const key = 'enemy_tank';
        const health = ENEMY.DEFAULT_HEALTH;

        super(scene, x, y, key, health);

        // Aquí se podrá poner su velocidad, IA, etc.
        this.speed = ENEMY.SPEED;

        
        this.setColliders();
        
        this.body.setAllowGravity(false);
        this.direction = -1;
        this.setImmovable(true);

        this.start = true;
    }


    reset(x, y) {
        super.reset(x, y);
    }

    setColliders()
    {
        this.scene.physics.add.collider(this, this.scene.obstacleManager.getGroup());
        if(this.body){
            console.log("Setting collide world bounds")
            this.body.setCollideWorldBounds(true);
        }
        
    }

    colisionHandler()
    {
        if (this.body.blocked.left || this.body.blocked.right||this.body.blocked.up || this.body.blocked.down)
        {
            

                if (Math.random() < 0.5 )  
                {
                    console.log("Cambio Horizontal");
                    this.body.setVelocity(this.speed * this.direction,0);
                }else
                {
                    console.log("Cambio Vertical");
                    if (Math.random() < 0.5 )  
                    {
                        this.direction *=-1;
                    }
                    this.body.setVelocity(0, this.speed * this.direction);

        }

        
            
        }
    }
    preUpdate(time,delta)
    {
        super.preUpdate(time,delta);
        if (this.start === true) {
            this.body.setVelocity(0,this.speed * this.direction);
            this.start = false;
        }
        this.colisionHandler();
        
    } 

    
}

export { TankBasic };