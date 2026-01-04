import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankFast extends BaseEnemy {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('tank_fast', 'tanks/grey/tank2_grey.png', { frameWidth: 16, frameHeight: 16 });
    }

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