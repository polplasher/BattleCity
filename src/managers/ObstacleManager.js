import { Obstacle } from '../environment/obstacles/Obstacle.js';
import { OBSTACLE } from '../core/constants.js';

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.staticGroup();
    }

    createFromArray(positions, options = {}) {
        const blockSize = OBSTACLE.BLOCK_SIZE;
        const cellSize = blockSize / 4; // Cada celda es 1/4 del bloque total

        positions.forEach(pos => this.#createBlock(pos.x, pos.y, blockSize, cellSize));
    }

    #createBlock(centerX, centerY, blockSize, cellSize) {
        const halfBlock = blockSize / 2;
        const startX = centerX - halfBlock + cellSize / 2;
        const startY = centerY - halfBlock + cellSize / 2;

        // Crear grid de 4x4
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;

                const cell = new Obstacle(this.scene, x, y, 'obstacle');
                cell.configureCellSize(cellSize);
                this.obstacles.add(cell);
            }
        }
    }

    createFromTilemap(tilemap, layerName) {
        // Para cargar desde Tiled más adelante
        // const layer = tilemap.getLayer(layerName);
        // ...
    }

    getGroup() { return this.obstacles; }
    destroy() { this.obstacles.clear(true, true); }
}

export { ObstacleManager };