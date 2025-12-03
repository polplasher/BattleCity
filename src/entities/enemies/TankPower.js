import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankPower extends BaseEnemy {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('tank_power', 'tanks/grey/tank3_grey.png', { frameWidth: 16, frameHeight: 16 });
    }

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