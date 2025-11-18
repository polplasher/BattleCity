import { ENEMY } from '../../core/constants.js';


class BaseEnemy extends Phaser.Physics.Arcade.Sprite {

    // Constructor basico para la salud 
    constructor(scene, x, y, key, health) {

        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);

        this.health = health;
        this.maxHealth = health;
        this.body.setCollideWorldBounds(true);
        
        
        
    }

    // Aplica daño
    takeDamage(amount = 1) {
        this.health -= amount;

        if (this.health <= 0) {
            this.die();
        }
    }

    // Muerte + explosion
    die() {
        if (this.scene.explosionManager) {
            this.scene.explosionManager.spawnExplosion(this.x, this.y);
        }

        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.reset(-500, -500);
        }
    }

    // Pooling
    reset(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(x, y);
        this.health = this.maxHealth;
        this.clearTint();
    }

    

}

export { BaseEnemy };