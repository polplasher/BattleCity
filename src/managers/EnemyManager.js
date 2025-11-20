import { TankBasic } from '../entities/enemies/TankBasic.js';

class EnemyManager {
    constructor(scene, bulletManager) {
        this.scene = scene;
        this.bulletManager = bulletManager;
        // Ensure child updates run so enemy `preUpdate` is called when grouped
        this.enemies = scene.physics.add.group({ runChildUpdate: true });
    }

    // Enemigo basico para porbar
    createEnemy(x, y) {
        let enemy = this.enemies.getFirst(false);

        if (enemy) {
            enemy.setBulletManager(this.bulletManager);
            enemy.reset(x, y);
        } else {
            enemy = new TankBasic(this.scene, x, y);
            enemy.setBulletManager(this.bulletManager);
            this.enemies.add(enemy);

        }

        return enemy;
    }

    getGroup() { return this.enemies; }

    destroy() { this.enemies.clear(true, true); }
}

export { EnemyManager };