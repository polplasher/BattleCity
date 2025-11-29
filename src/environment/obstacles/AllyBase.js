import { BaseObstacle } from './BaseObstacle.js';

class AllyBase extends BaseObstacle {
    constructor(scene, x, y) {
        super(scene, x, y, 'ally_base', { isDestructible: true });
        this.setFrame(0); // Frame 0 = viva
    }

    static preload(scene) {
        scene.load.spritesheet('ally_base', 'assets/sprites/environment/ally_base.png', {
            frameWidth: 16, // Ajusta según tu sprite
            frameHeight: 16
        });
    }

    onHit(bullet) {
        this.destroy();
    }

    destroy() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;

        // Cambiar a frame de destruida
        this.setFrame(1);

        if (this.scene.gameManager) {
            this.scene.gameManager.onBaseDestroyed();
        }

        if (this.scene.explosionManager) {
            this.scene.explosionManager.spawnExplosion(this.x, this.y);
        }
    }
}

export { AllyBase };