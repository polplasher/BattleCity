import { BaseObstacle } from './BaseObstacle.js';

class BrickWall extends BaseObstacle {
    constructor(scene, x, y) { super(scene, x, y, 'brick_wall', { isDestructible: true }); }
    static preload(scene) { scene.load.image('brick_wall', 'assets/sprites/environment/destructible_test.png'); }
}

export { BrickWall };