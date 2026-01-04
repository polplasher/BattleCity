import { highScoreManager } from '../managers/HighScoreManager.js';
import { TOTAL_STAGES } from '../core/levels.js';
import { PLAYER } from '../core/constants.js';

class ScoreMenu extends Phaser.Scene {
    constructor() {
        super({ key: "ScoreMenuScene" });
        
    }

    init(data) {
        // Recibir datos de la escena anterior
        this.playerScore = data.score || 0;
        this.stage = data.stage || 1;
        this.lives = data.lives || 0;
        this.reason = data.reason || '';
        this.isHighScore = data.isHighScore || false;
        this.isVictory = data.isVictory || false;
        this.isLastStage = data.isLastStage || false;
        
        this.basicDefeated = 0;
        this.fastDefeated = 0;
        this.powerDefeated = 0;
        this.heavyDefeated = 0;
        
        // Determine if player can continue to next stage
        this.canContinue = this.isVictory && !this.isLastStage && this.lives > 0;
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
                        // power-up;;
                        break;
                default:
                    break;
            }
        }

const centerX = this.scale.width / 2;
    
        
        //Basic Tanks count
        this.add.sprite(centerX - 78, 120, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(centerX - 70, 120, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(centerX - 58, 119, '00Text');
        this.add.image(centerX - 12, 121, 'arrow');
        this.add.sprite(centerX - 30, 120, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(centerX - 22, 120, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(centerX, 120, 'tank_basic');

        //Fast Tanks count
        this.add.sprite(centerX - 78, 140, 'numberSpritesheet', Math.floor((this.fastDefeated*2)/10));
        this.add.sprite(centerX - 70, 140, 'numberSpritesheet', (this.fastDefeated*2)%10);
        this.add.image(centerX - 58, 139, '00Text');
        this.add.image(centerX - 12, 141, 'arrow');
        this.add.sprite(centerX - 30, 140, 'numberSpritesheet', Math.floor(this.fastDefeated/10));
        this.add.sprite(centerX - 22, 140, 'numberSpritesheet', this.fastDefeated%10);
        this.add.image(centerX, 140, 'tank_fast');
        //Power Tanks count
        this.add.sprite(centerX - 78, 160, 'numberSpritesheet', Math.floor((this.powerDefeated*3)/10));
        this.add.sprite(centerX - 70, 160, 'numberSpritesheet', (this.powerDefeated*3)%10);
        this.add.image(centerX - 58, 159, '00Text');
        this.add.image(centerX - 12, 161, 'arrow');
        this.add.sprite(centerX - 30, 160, 'numberSpritesheet', Math.floor(this.powerDefeated/10));
        this.add.sprite(centerX - 22, 160, 'numberSpritesheet', this.powerDefeated%10);
        this.add.image(centerX, 160, 'tank_power');

        //Heavy Tanks count
        this.add.sprite(centerX - 78, 180, 'numberSpritesheet', Math.floor((this.heavyDefeated*4)/10));
        this.add.sprite(centerX - 70, 180, 'numberSpritesheet', (this.heavyDefeated*4)%10);
        this.add.image(centerX - 58, 179, '00Text');
        this.add.image(centerX - 12, 181, 'arrow');
        this.add.sprite(centerX - 30, 180, 'numberSpritesheet', Math.floor(this.heavyDefeated/10));
        this.add.sprite(centerX - 22, 180, 'numberSpritesheet', this.heavyDefeated%10);
        this.add.image(centerX, 180, 'tank_armor');
    
        //Total Tanks count
        this.totalTankNumber = this.basicDefeated + this.fastDefeated + this.powerDefeated + this.heavyDefeated;
        this.add.sprite(centerX - 78, 200, 'numberSpritesheet', Math.floor((this.basicDefeated + this.fastDefeated * 2 + this.powerDefeated * 3 + this.heavyDefeated * 4)/10));
        this.add.sprite(centerX - 70, 200, 'numberSpritesheet', (this.basicDefeated + this.fastDefeated * 2 + this.powerDefeated * 3 + this.heavyDefeated * 4)%10);
        this.add.image(centerX - 58, 199, '00Text');
        this.add.image(centerX - 12, 201, 'arrow');
        this.add.sprite(centerX - 30, 200, 'numberSpritesheet', Math.floor(this.totalTankNumber/10));
        this.add.sprite(centerX - 22, 200, 'numberSpritesheet', this.totalTankNumber%10);
        this.add.text(centerX - 7, 200, 'TOTAL', { fontSize: '10px', fill: '#fff' }).setOrigin(0, 0.5);

        
        const topScore = highScoreManager.getTopScore();

        // HI-SCORE en la parte superior
        
        this.add.image(centerX - 50, 30, 'hiScoreText').setOrigin(0.5).setScale(1.5);
        /*this.add.text(centerX, 20, 'HI-SCORE', {
            fontSize: '12px',
            fill: '#e44'
        }).setOrigin(0.5);*/
        /*this.add.sprite(centerX + 50, 30, 'numberSpritesheet', Math.floor(this.topScore/1000)).setOrigin(0.5).setScale(1.5);
        this.add.sprite(centerX + 58, 30, 'numberSpritesheet', this.topScore%10).setOrigin(0.5).setScale(1.5);
        this.add.image(centerX + 58, 29, '00Text').setOrigin(0.5).setScale(1.5);*/

        this.HIScoreThousends = this.add.sprite(centerX + 30, 30, 'numberSpritesheet', Math.floor(topScore/1000)).setOrigin(0.5).setScale(1.5);
        this.HIScoreHundreds = this.add.sprite(this.HIScoreThousends.x + 12, 30, 'numberSpritesheet', Math.floor(topScore/100)%10).setOrigin(0.5).setScale(1.5);
        this.HIScore0s = this.add.sprite(this.HIScoreHundreds.x + 20, 29, '00Text', 0).setOrigin(0.5).setScale(1.5);

        
        // Stage
        this.add.image(centerX - 30, 80, 'stageTextWhite').setOrigin(0.5).setScale(1.5);
        this.add.sprite(centerX + 10, 80, 'numberSpritesheet', this.stage).setScale(1.5).setOrigin(0.5);

        
        // Tu score
        /*
        this.add.text(centerX - 60, 100, 'YOUR SCORE', {
            fontSize: '10px',
            fill: '#e84'
        }).setOrigin(0, 0.5);
        */
        /*
        this.add.text(centerX + 60, 100, this.playerScore.toString().padStart(6, '0'), {
            fontSize: '10px',
            fill: '#fff'
        }).setOrigin(1, 0.5);
        */

        // Si es highscore nuevo
        if (this.isHighScore && this.playerScore > 0) {
            this.add.text(centerX, 220, '★ NEW HIGH SCORE! ★', {
                fontSize: '10px',
                fill: '#ff0'
            }).setOrigin(0.5).setScale(1.5);

            // Guardar automáticamente (en el futuro podrías pedir nombre)
            highScoreManager.addScore('PLAYER', this.playerScore, this.stage);
        }

        // Motivo de game over
        if (this.reason && !this.isVictory) {
            let reasonText = '';
            switch(this.reason) {
                case 'base-destroyed':
                    reasonText = 'BASE DESTROYED';
                    break;
                case 'no-lives':
                    reasonText = 'NO LIVES LEFT';
                    break;
                default:
                    reasonText = 'GAME OVER';
            }
            this.add.text(centerX, 60, reasonText, {
                fontSize: '10px',
                fill: '#f44'
            }).setOrigin(0.5).setScale(1.5);
        }

        // Victory message
       /* if (this.isVictory) {
            if (this.isLastStage) {
                this.add.text(centerX, 60, '★ CONGRATULATIONS! ★', {
                    fontSize: '10px',
                    fill: '#0f0'
                }).setOrigin(0.5).setScale(1.5);
            } else {
                this.add.text(centerX, 60, 'STAGE CLEAR!', {
                    fontSize: '10px',
                    fill: '#0f0'
                }).setOrigin(0.5).setScale(1.5);
            }
        }*/

        // Instrucción para continuar
        if (this.canContinue) {
            this.add.text(centerX, 232, `PRESS ENTER FOR STAGE ${this.stage + 1}`, {
                fontSize: '8px',
                fill: '#0f0'
            }).setOrigin(0.5);
            
            this.add.text(centerX, 245, 'PRESS ESC FOR MENU', {
                fontSize: '8px',
                fill: '#888'
            }).setOrigin(0.5);
        } else {
            this.add.text(centerX, 240, 'PRESS ENTER TO CONTINUE', {
                fontSize: '8px',
                fill: '#888'
            }).setOrigin(0.5);
        }

        // Input handling
        this.input.keyboard.once('keydown-ENTER', () => {
            if (this.canContinue) {
                // Go to stage intro scene which handles the animation
                // Reset lives for the new stage
                this.scene.start('StageIntroScene', {
                    stage: this.stage + 1,
                    score: this.playerScore,
                    lives: PLAYER.INITIAL_LIVES
                });
            } else {
                // Game over or completed all stages - go to menu
                this.scene.start('MenuScene');
            }
        });
        
        // ESC to go back to menu (even if can continue)
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
}

export { ScoreMenu };