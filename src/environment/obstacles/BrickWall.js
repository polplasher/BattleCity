import { BaseObstacle } from './BaseObstacle.js';

class BrickWall extends BaseObstacle {
    constructor(scene, x, y) { super(scene, x, y, 'brick_wall', { isDestructible: true }); }
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.image('brick_wall', 'environment/destructible_test.png');
    }
}

export { BrickWall };