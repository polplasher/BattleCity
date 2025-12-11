import { highScoreManager } from '../managers/HighScoreManager.js';

class ScoreMenu extends Phaser.Scene {
    constructor() {
        super({ key: "ScoreMenuScene" });
    }

    init(data) {
        // Recibir datos de la escena anterior
        this.playerScore = data.score || 0;
        this.stage = data.stage || 1;
        this.reason = data.reason || '';
        this.isHighScore = data.isHighScore || false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#111');

        this.basicDefeated = 15;
        this.fastDefeated = 8;
        this.powerDefeated = 5;
        this.heavyDefeated = 2;

        this.add.text(this.scale.width / 2, 10, 'Score Menu', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
        
        this.add.sprite(this.scale.width / 2 - 30, 120, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 120, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(this.scale.width / 2, 120, 'tank_basic');

        this.add.sprite(this.scale.width / 2 - 30, 140, 'numberSpritesheet', Math.floor(this.fastDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 140, 'numberSpritesheet', this.fastDefeated%10);
        this.add.image(this.scale.width / 2, 140, 'tank_fast');

        this.add.sprite(this.scale.width / 2 - 30, 160, 'numberSpritesheet', Math.floor(this.powerDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 160, 'numberSpritesheet', this.powerDefeated%10);
        this.add.image(this.scale.width / 2, 160, 'tank_power');

        this.add.sprite(this.scale.width / 2 - 30, 180, 'numberSpritesheet', Math.floor(this.heavyDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 180, 'numberSpritesheet', this.heavyDefeated%10);
        this.add.image(this.scale.width / 2, 180, 'tank_armor');
    


        const centerX = this.scale.width / 2;
        const topScore = highScoreManager.getTopScore();

        // HI-SCORE en la parte superior
        this.add.text(centerX, 20, 'HI-SCORE', {
            fontSize: '12px',
            fill: '#e44'
        }).setOrigin(0.5);

        this.add.text(centerX, 38, topScore.toString().padStart(6, '0'), {
            fontSize: '12px',
            fill: '#e84'
        }).setOrigin(0.5);

        // Stage
        this.add.text(centerX, 70, `STAGE  ${this.stage}`, {
            fontSize: '12px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Tu score
        this.add.text(centerX - 60, 100, 'YOUR SCORE', {
            fontSize: '10px',
            fill: '#e84'
        }).setOrigin(0, 0.5);

        this.add.text(centerX + 60, 100, this.playerScore.toString().padStart(6, '0'), {
            fontSize: '10px',
            fill: '#fff'
        }).setOrigin(1, 0.5);

        // Si es highscore nuevo
        if (this.isHighScore && this.playerScore > 0) {
            this.add.text(centerX, 140, '★ NEW HIGH SCORE! ★', {
                fontSize: '10px',
                fill: '#ff0'
            }).setOrigin(0.5);

            // Guardar automáticamente (en el futuro podrías pedir nombre)
            highScoreManager.addScore('PLAYER', this.playerScore, this.stage);
        }

        // Motivo de game over
        if (this.reason) {
            const reasonText = this.reason === 'base-destroyed' ? 'BASE DESTROYED' : 'NO LIVES LEFT';
            this.add.text(centerX, 180, reasonText, {
                fontSize: '10px',
                fill: '#f44'
            }).setOrigin(0.5);
        }

        // Instrucción para continuar
        this.add.text(centerX, 220, 'PRESS ENTER TO CONTINUE', {
            fontSize: '8px',
            fill: '#888'
        }).setOrigin(0.5);

        // Input para volver al menú
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('MenuScene');
        });
    }
}

export { ScoreMenu };