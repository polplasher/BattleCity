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
        // La base aliada es indestructible hasta que se le quite toda su vida
        // Por ahora la destruimos de inmediato
        this.destroy();
    }

    destroy() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.setFrame(1); // Frame 1 = destruida

        // Emitir eventos en lugar de llamar directamente
        this.scene.events.emit(EVENTS.BASE_DESTROYED, { x: this.x, y: this.y });
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });
        
        // Mantener el sprite visible con el frame destruido
        // No llamar a super.destroy() para que siga siendo colisionable
    }
}

export { AllyBase };