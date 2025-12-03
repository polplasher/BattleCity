import { BaseObstacle } from './BaseObstacle.js';

class SteelWall extends BaseObstacle {
    constructor(scene, x, y) { super(scene, x, y, 'steel_wall', { isDestructible: false }); }

    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.image('steel_wall', 'environment/steel_wall.png');
    }

    onHit(bullet) {
        // TODO: Special bullets can destroy steel walls
    }
}

export { SteelWall };