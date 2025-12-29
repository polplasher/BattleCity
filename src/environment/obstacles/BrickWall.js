import { BaseObstacle } from './BaseObstacle.js';

class BrickWall extends BaseObstacle {
    constructor(scene, x, y, variant = 0) { 
        // Variant should be 0-15 for a 16-tile set
        super(scene, x, y, 'brick_wall', { 
            isDestructible: true,
            frame: variant 
        }); 
    }
    
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        // Load as spritesheet: 16x16 texture with 4x4 frames
        scene.load.spritesheet('brick_wall', 'environment/brick_tile.png', {
            frameWidth: 4,
            frameHeight: 4
        });
    }

    onHit(bullet) {
        if (!this.isDestroyed) {
            this.destroy();
        }
    }
}

export { BrickWall };