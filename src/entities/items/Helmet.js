import { BasePowerUp } from './BasePowerUp.js';
import { POWERUP } from '../../core/constants.js';

class Helmet extends BasePowerUp {
    constructor(scene, x, y) {
        
        super(scene, x, y, POWERUP.HELMET);
    }

   
    applyEffect(player) {
        if (player.activateShield) {
            player.activateShield(10000); 
            
        }
    }
}

export { Helmet };