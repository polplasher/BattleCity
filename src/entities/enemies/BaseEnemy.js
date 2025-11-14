
class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
    
    // constructor basico para la salud 
    constructor(scene, x, y, key, health) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

         
        this.health = health;
        this.maxHealth = health; 

        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.setImmovable(true);
    }

    
     //Aplica daño
     
    takeDamage(amount = 1) {
        this.health -= amount;

        if (this.health <= 0) {
            this.die();
        } 
    }

  

  //muerte + explosion
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

    
      //pooling
     
    reset(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(x, y);
        this.health = this.maxHealth; 
        this.clearTint();
    }
}

export { BaseEnemy };