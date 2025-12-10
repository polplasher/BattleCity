import { EVENTS } from '../core/events.js';
import { POWERUP } from '../core/constants.js';

class ScorePopupManager {
    constructor(scene) {
        this.scene = scene;
        this.popupPool = [];
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.scene.events.on(EVENTS.ENEMY_DIED, this.onEnemyDied, this);
        this.scene.events.on(EVENTS.POWERUP_COLLECTED, this.onPowerUpCollected, this);
    }

    onEnemyDied(data) {
        this.showPopup(data.x, data.y, data.points);
    }

    onPowerUpCollected(data) {
        this.showPopup(data.x, data.y, POWERUP.POINTS);
    }

    showPopup(x, y, points) {
        const popup = this.#getPopup();
        
        popup.setText(points.toString());
        popup.setPosition(x, y - 10);
        popup.setAlpha(1);
        popup.setActive(true);
        popup.setVisible(true);

        // Animación: sube y desaparece
        this.scene.tweens.add({
            targets: popup,
            y: y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                popup.setActive(false);
                popup.setVisible(false);
            }
        });
    }

    #getPopup() {
        // Buscar un popup inactivo en el pool
        let popup = this.popupPool.find(p => !p.active);
        
        if (!popup) {
            // Crear nuevo popup si no hay disponibles
            popup = this.scene.add.text(0, 0, '', {
                fontSize: '8px',
                fontFamily: 'Press Start 2P, monospace',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5).setDepth(100);
            
            this.popupPool.push(popup);
        }
        
        return popup;
    }

    destroy() {
        this.scene.events.off(EVENTS.ENEMY_DIED, this.onEnemyDied, this);
        this.scene.events.off(EVENTS.POWERUP_COLLECTED, this.onPowerUpCollected, this);
        
        this.popupPool.forEach(popup => popup.destroy());
        this.popupPool = [];
    }
}

export { ScorePopupManager };
