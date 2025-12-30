import { highScoreManager } from '../managers/HighScoreManager.js';
import { SpawnManager } from '../managers/SpawnManager.js';

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
        this.basicDefeated = 0;
        this.fastDefeated = 0;
        this.powerDefeated = 0;
        this.heavyDefeated = 0;
    }

    create() {
        
        const scoreList = this.registry.get('scoreSumary');
        this.cameras.main.setBackgroundColor('#111');
        for (var i = 0; i < scoreList.length; i++) {
            switch(scoreList[i]) {
                case 100:
                    this.basicDefeated += 1;
                    break;
                case 200:
                    this.fastDefeated += 1;
                    break;  
                case 300:
                    this.powerDefeated += 1;
                    break;
                case 400:
                    this.heavyDefeated += 1;
                    break;
                case 500:
                        // power-up;; TODO
                        break;
                default:
                    break;
            }
        }


        this.add.text(this.scale.width / 2, 10, 'Score Menu', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
        
        //Basic Tanks count
        this.add.sprite(this.scale.width / 2 - 68, 120, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(this.scale.width / 2 - 60, 120, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(this.scale.width / 2 - 48, 119, '00Text');
        this.add.sprite(this.scale.width / 2 - 28, 120, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 120, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(this.scale.width / 2, 120, 'tank_basic');

        //Fast Tanks count
        this.add.sprite(this.scale.width / 2 - 68, 140, 'numberSpritesheet', Math.floor((this.fastDefeated*2)/10));
        this.add.sprite(this.scale.width / 2 - 60, 140, 'numberSpritesheet', (this.fastDefeated*2)%10);
        this.add.image(this.scale.width / 2 - 48, 139, '00Text');
        this.add.sprite(this.scale.width / 2 - 28, 140, 'numberSpritesheet', Math.floor(this.fastDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 140, 'numberSpritesheet', this.fastDefeated%10);
        this.add.image(this.scale.width / 2, 140, 'tank_fast');

        //Power Tanks count
        this.add.sprite(this.scale.width / 2 - 68, 160, 'numberSpritesheet', Math.floor((this.powerDefeated*2)/10));
        this.add.sprite(this.scale.width / 2 - 60, 160, 'numberSpritesheet', (this.powerDefeated*2)%10);
        this.add.image(this.scale.width / 2 - 48, 159, '00Text');
        this.add.sprite(this.scale.width / 2 - 28, 160, 'numberSpritesheet', Math.floor(this.powerDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 160, 'numberSpritesheet', this.powerDefeated%10);
        this.add.image(this.scale.width / 2, 160, 'tank_power');

        //Heavy Tanks count
        this.add.sprite(this.scale.width / 2 - 68, 180, 'numberSpritesheet', Math.floor((this.heavyDefeated*2)/10));
        this.add.sprite(this.scale.width / 2 - 60, 180, 'numberSpritesheet', (this.heavyDefeated*2)%10);
        this.add.image(this.scale.width / 2 - 48, 179, '00Text');
        this.add.sprite(this.scale.width / 2 - 28, 180, 'numberSpritesheet', Math.floor(this.heavyDefeated/10));
        this.add.sprite(this.scale.width / 2 - 20, 180, 'numberSpritesheet', this.heavyDefeated%10);
        this.add.image(this.scale.width / 2, 180, 'tank_armor');
    
        //Total Tanks count
        this.totalTankNumber = this.basicDefeated + this.fastDefeated + this.powerDefeated + this.heavyDefeated;
        this.add.sprite(this.scale.width / 2 - 68, 200, 'numberSpritesheet', Math.floor((this.totalTankNumber)/10));
        this.add.sprite(this.scale.width / 2 - 60, 200, 'numberSpritesheet', (this.totalTankNumber)%10);
        this.add.image(this.scale.width / 2 - 48, 199, '00Text');
        this.add.sprite(this.scale.width / 2 - 28, 200, 'numberSpritesheet', Math.floor(this.totalTankNumber/10));
        this.add.sprite(this.scale.width / 2 - 20, 200, 'numberSpritesheet', this.totalTankNumber%10);
        this.add.text(this.scale.width / 2 - 10, 200, 'TOTAL', { fontSize: '10px', fill: '#fff' }).setOrigin(0, 0.5);

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
            this.add.text(centerX, 220, '★ NEW HIGH SCORE! ★', {
                fontSize: '10px',
                fill: '#ff0'
            }).setOrigin(0.5);

            // Guardar automáticamente (en el futuro podrías pedir nombre)
            highScoreManager.addScore('PLAYER', this.playerScore, this.stage);
        }

        // Motivo de game over
        if (this.reason) {
            const reasonText = this.reason === 'base-destroyed' ? 'BASE DESTROYED' : 'NO LIVES LEFT';
            this.add.text(centerX, 55, reasonText, {
                fontSize: '10px',
                fill: '#f44'
            }).setOrigin(0.5);
        }

        // Instrucción para continuar
        this.add.text(centerX, 240, 'PRESS ENTER TO CONTINUE', {
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