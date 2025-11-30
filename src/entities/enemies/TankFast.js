import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankFast extends BaseEnemy {
    constructor(scene, x, y) {
        super(
            scene, 
            x, 
            y, 
            'tank_fast',              
            ENEMY.HEALTH_BASIC,      
            ENEMY.POINTS_FAST,        
            ENEMY.SPEED_FAST,         
            ENEMY.BULLET_SPEED_NORMAL 
        );
    }
}
export { TankFast };