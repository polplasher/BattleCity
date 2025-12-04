import { BaseObstacle } from './BaseObstacle.js';
import { EVENTS } from '../../core/events.js';

class AllyBase extends BaseObstacle {
    constructor(scene, x, y) {
        super(scene, x, y, 'ally_base', { isDestructible: true });
        this.setFrame(0); // Frame 0 = viva
    }

    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('ally_base', 'environment/ally_base.png', {
            frameWidth: 16,
            frameHeight: 16,
            endFrame: 1
        });
    }

    onHit(bullet) {
        this.destroy();
    }

    destroy() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.setFrame(1);

        // Emitir eventos en lugar de llamar directamente
        this.scene.events.emit(EVENTS.BASE_DESTROYED, { x: this.x, y: this.y });
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });
    }
}

export { AllyBase };