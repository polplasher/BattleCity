import { BrickWall } from '../environment/obstacles/BrickWall.js';
import { SteelWall } from '../environment/obstacles/SteelWall.js';
import { AllyBase } from '../environment/obstacles/allyBase.js';
import { OBSTACLE } from '../core/constants.js';

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.staticGroup();
        this.allyBase = null;
    }

    createFromArray(positions) {
        const blockSize = OBSTACLE.BLOCK_SIZE;
        const cellSize = blockSize / 4;

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

                const cell = new BrickWall(this.scene, x, y);
                cell.configureCellSize(cellSize);
                this.obstacles.add(cell);
            }
        }
    }

    createAllyBase(x, y) {
        this.allyBase = new AllyBase(this.scene, x, y);
        this.obstacles.add(this.allyBase);
        return this.allyBase;
    }

    createSteelWall(x, y) {
        const wall = new SteelWall(this.scene, x, y);
        this.obstacles.add(wall);
        return wall;
    }

    onBulletHitObstacle(bullet, obstacle) {
        if (obstacle && typeof obstacle.onHit === 'function') {
            obstacle.onHit(bullet);
        }
    }

    getGroup() { return this.obstacles; }
    getAllyBase() { return this.allyBase; }
    destroy() {
        this.obstacles.clear(true, true);
        this.allyBase = null;
    }
}

export { ObstacleManager };