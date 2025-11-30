import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankPower extends BaseEnemy {
    constructor(scene, x, y) {
        super(
            scene, 
            x, 
            y, 
            'tank_power',             
            ENEMY.HEALTH_BASIC,       
            ENEMY.POINTS_POWER,       
            ENEMY.SPEED_NORMAL,       
            ENEMY.BULLET_SPEED_FAST   
        );
    }
}
export { TankPower };