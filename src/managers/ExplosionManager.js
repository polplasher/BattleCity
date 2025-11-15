import { Explosion } from '../entities/effects/Explosion.js';

class ExplosionManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = scene.add.group();
    }

    spawnExplosion(x, y) {
        let explosion = this.pool.getFirst(false);

        if (!explosion) {
            explosion = new Explosion(this.scene, x, y, 'explosion_large');
            this.pool.add(explosion);
        }

        explosion.spawn(x, y, 'explosion_large_anim');
    }

    getPool() { return this.pool; }
}

export { ExplosionManager };