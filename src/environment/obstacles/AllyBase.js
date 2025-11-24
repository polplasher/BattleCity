import { BaseObstacle } from './BaseObstacle.js';

class AllyBase extends BaseObstacle {
    constructor(scene, x, y) { super(scene, x, y, 'ally_base', { isDestructible: true }); }
    static preload(scene) { scene.load.image('ally_base', 'assets/sprites/environment/ally_base.png'); }

    onHit(bullet) {
        this.destroy();
    }

    destroy() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;

        if (this.scene.gameStateManager) {
            this.scene.gameStateManager.onBaseDestroyed();
        }

        if (this.scene.explosionManager) {
            this.scene.explosionManager.createExplosion(this.x, this.y, 'large');
        }

        super.destroy();
    }
}

export { AllyBase };