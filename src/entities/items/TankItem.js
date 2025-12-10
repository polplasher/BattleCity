import { BasePowerUp } from './BasePowerUp.js';
import { POWERUP } from '../../core/constants.js';

class TankItem extends BasePowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, POWERUP.TANK);
    }

    applyEffect(player) {
       
        if (this.scene.gameManager) {
            this.scene.gameManager.heal();
            
        }
    }
}

export { TankItem };