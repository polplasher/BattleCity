import { BaseObstacle } from './BaseObstacle.js';

class BrickWall extends BaseObstacle {
    constructor(scene, x, y) { 
        super(scene, x, y, 'brick_wall', { isDestructible: true }); 
    }
    
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.image('brick_wall', 'environment/brick_tile.png');
    }

    onHit(bullet) {
        // Los BrickWalls se destruyen inmediatamente al ser impactados
        if (!this.isDestroyed) {
            this.destroy();
        }
    }
}

export { BrickWall };