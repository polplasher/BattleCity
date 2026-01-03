import { BasePowerUp } from './BasePowerUp.js';
import { POWERUP, PLAYER } from '../../core/constants.js';

class Helmet extends BasePowerUp {
    constructor(scene, x, y) {
        
        super(scene, x, y, POWERUP.HELMET);
    }

   
    applyEffect(player) {
        if (player.activateShield) {
            player.activateShield(PLAYER.SHIELD_DURATION);
        }
    }
}

export { Helmet };