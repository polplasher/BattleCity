import { TankBasic } from '../entities/enemies/TankBasic.js';

class EnemyManager {
    constructor(scene, bulletManager) {
        this.scene = scene;
        this.bulletManager = bulletManager;
        this.enemies = scene.physics.add.group({ runChildUpdate: true });
    }

    createEnemy(x, y, EnemyClass = TankBasic) {
        const enemy = this.#getOrCreateEnemy(EnemyClass, x, y);
        this.#setupEnemy(enemy, x, y);
        return enemy;
    }

    #getOrCreateEnemy(EnemyClass, x, y) {
        let enemy = this.enemies.getFirst(false);
        if (!enemy) {
            enemy = new EnemyClass(this.scene, x, y);
            this.enemies.add(enemy);
        }
        return enemy;
    }

    #setupEnemy(enemy, x, y) {
        enemy.setBulletManager(this.bulletManager);
        if (enemy.active) {
            enemy.reset(x, y);
        }
    }

    getGroup() { return this.enemies; }

    destroy() { this.enemies.clear(true, true); }
}

export { EnemyManager };