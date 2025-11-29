import { BrickWall } from '../environment/obstacles/BrickWall.js';
import { AllyBase } from '../environment/obstacles/allyBase.js';
import { SteelWall } from '../environment/obstacles/SteelWall.js';
import { OBSTACLE } from '../core/constants.js';

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.staticGroup();
        this.allyBase = null;
    }

    createObstacle(ObstacleClass, x, y) {
        const obstacle = new ObstacleClass(this.scene, x, y);
        this.obstacles.add(obstacle);
        return obstacle;
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

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;

                const cell = this.createBrickWall(x, y);
                cell.configureCellSize(cellSize);
            }
        }
    }

    createAllyBase(x, y) {
        this.allyBase = this.createObstacle(AllyBase, x, y);
        return this.allyBase;
    }

    createSteelWall(x, y) {
        return this.createObstacle(SteelWall, x, y);
    }

    createBrickWall(x, y) {
        return this.createObstacle(BrickWall, x, y);
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