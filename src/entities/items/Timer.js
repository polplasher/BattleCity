import { BasePowerUp } from './BasePowerUp.js';
import { POWERUP } from '../../core/constants.js';

class Timer extends BasePowerUp {
    constructor(scene, x, y) {
        
        super(scene, x, y, POWERUP.TIMER || 'timer');
    }

    applyEffect(player) {
        if (!this.scene.enemyManager) return;

        //Obtener todos los enemigos vivos
        const enemies = this.scene.enemyManager.getGroup().getChildren();
        const affectedEnemies = [];

        //Congelarlos a todos
        enemies.forEach(enemy => {
            if (enemy.active) {
                enemy.freeze();
                affectedEnemies.push(enemy);
            }
        });

       //congelar 10 sec(no pone cuanto en la wiki)
        this.scene.time.delayedCall(10000, () => {
            affectedEnemies.forEach(enemy => {
                
                if (enemy && enemy.active) {
                    enemy.unfreeze();
                }
            });
        });
    }
}

export { Timer };