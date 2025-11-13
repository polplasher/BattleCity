import { Obstacle } from '../entities/obstacles/Obstacle.js';

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.staticGroup();
    }

    createFromArray(positions) {
        positions.forEach(pos => {
            const obstacle = new Obstacle(this.scene, pos.x, pos.y, 'obstacle');
            this.obstacles.add(obstacle);
        });
    }

    createFromTilemap(tilemap, layerName) {
        // Para cargar desde Tiled más adelante
        // const layer = tilemap.getLayer(layerName);
        // ...
    }

    getGroup() {
        return this.obstacles;
    }

    destroy() {
        this.obstacles.clear(true, true);
    }
}

export { ObstacleManager };