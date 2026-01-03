import { Explosion } from '../entities/effects/Explosion.js';
import { EVENTS } from '../core/events.js';

class ExplosionManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = scene.add.group();

        // Escuchar evento de explosión
        this.scene.events.on(EVENTS.EXPLOSION_SPAWN, this.onExplosionSpawn, this);
    }

    onExplosionSpawn(data) {
        this.spawnExplosion(data.x, data.y);
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

    destroy() {
        // Remove event listener to prevent stale references
        this.scene.events.off(EVENTS.EXPLOSION_SPAWN, this.onExplosionSpawn, this);
        
        // Clear the pool if it still exists and is valid
        // Note: Phaser may have already destroyed the group during scene shutdown
        if (this.pool && this.pool.children) {
            this.pool.clear(true, true);
        }
        this.pool = null;
    }
}

export { ExplosionManager };