import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankBasic extends BaseEnemy {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('tank_basic', 'tanks/grey/tank1_grey.png', { frameWidth: 16, frameHeight: 16 });
    }

    constructor(scene, x, y) {
        super(
            scene, 
            x, 
            y, 
            'tank_basic',             
            ENEMY.HEALTH_BASIC,       
            ENEMY.POINTS_BASIC,       
            ENEMY.SPEED_SLOW,        
            ENEMY.BULLET_SPEED_SLOW  
        );
    }
}
export { TankBasic };