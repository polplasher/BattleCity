import { BasePowerUp } from './BasePowerUp.js';
import { POWERUP } from '../../core/constants.js';

class Grenade extends BasePowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, POWERUP.GRENADE || 'grenade');
    }

    applyEffect(player) {
       
        if (!this.scene.enemyManager) return;

        
        const enemies = this.scene.enemyManager.getGroup().getChildren();

        enemies.forEach(enemy => {
            
            if (enemy.active) {
                
              
                enemy.takeDamage(4);
            }
        });
    }
}

export { Grenade };