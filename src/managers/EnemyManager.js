import { TankBasic } from '../entities/enemies/TankBasic.js';

class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
    }

    // Enemigo basico para porbar
    createEnemy(x, y) {
        let enemy = this.enemies.getFirst(false);

        if (enemy) {
            enemy.reset(x, y);
        } else {
            enemy = new TankBasic(this.scene, x, y);
            this.enemies.add(enemy);
        }

        return enemy;
    }

    getGroup() { return this.enemies; }

    destroy() { this.enemies.clear(true, true); }
}

export { EnemyManager };