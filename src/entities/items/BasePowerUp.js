import { POWERUP } from '../../core/constants.js';
import { EVENTS } from '../../core/events.js';

class BasePowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        
        const textureKey = POWERUP.TEXTURES[type] || POWERUP.TEXTURES.helmet;
        super(scene, x, y, textureKey);

        this.scene = scene;
        this.type = type;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.body.setAllowGravity(false);
        
        if(scene.sound.get('powerup_appear')) {
            scene.sound.play('powerup_appear');
        }

        this.startDespawnTimer();
    }

    startDespawnTimer() {
        this.despawnTimer = this.scene.time.delayedCall(POWERUP.DURATION, () => {
            this.destroy();
        }, [], this);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            yoyo: true,
            repeat: -1,
            delay: POWERUP.DURATION - 3000
        });
    }

    collect(player) {
        if (!this.active) return;

        // 1. Sonido y visuales comunes
        this.scene.sound.play('powerup_pick');
        this.showScoreText();

        // 2. APLICAR EL EFECTO ESPECÍFICO 
        this.applyEffect(player);

        // 3. Emitir evento SOLO para puntuación en GameManager
        this.scene.events.emit(EVENTS.POWERUP_COLLECTED, { 
            type: this.type, 
            player: player,
            points: POWERUP.POINTS 
        });

        this.destroy();
    }

  
    applyEffect(player) {
        console.warn(`El PowerUp ${this.type} no tiene efecto implementado.`);
    }

    showScoreText() {
        const scoreText = this.scene.add.text(this.x, this.y, POWERUP.POINTS.toString(), {
            font: '10px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: scoreText,
            y: this.y - 20,
            alpha: 0,
            duration: 1000,
            onComplete: () => scoreText.destroy()
        });
    }

    destroy() {
        if (this.despawnTimer) this.despawnTimer.remove();
        super.destroy();
    }
}

export { BasePowerUp };