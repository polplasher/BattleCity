import { BaseObstacle } from './BaseObstacle.js';

class SteelWall extends BaseObstacle {
    constructor(scene, x, y) {
        super(scene, x, y, 'steel_wall', { isDestructible: false });
        // move pivot up a bit so the wall appears higher
        this.setOrigin(0.5, 1);
        if (this.body) this.body.updateFromGameObject();
    }

    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.image('steel_wall', 'environment/steel_tile.png');
    }
}

export { SteelWall };