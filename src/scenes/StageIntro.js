import { GAME_SIZE, STAGE_INTRO, PLAYER } from '../core/constants.js';

/**
 * Stage introduction scene - shows the grey screen animation with "STAGE X" text.
 * Used for transitions between stages and from menu to gameplay.
 */
class StageIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'StageIntroScene' });
    }

    /**
     * Receives data from previous scene
     * @param {object} data - { stage, score, lives }
     */
    init(data) {
        this.stageNumber = data.stage || 1;
        this.playerScore = data.score || 0;
        this.playerLives = data.lives || PLAYER.INITIAL_LIVES;
    }

    create() {
        this.cameras.main.setBackgroundColor('#111');

        const centerX = GAME_SIZE.WIDTH / 2;
        const centerY = GAME_SIZE.HEIGHT / 2;

        // Grey screens that close in from top and bottom
        this.screenUp = this.add.image(0, 0, 'startLevelScreen')
            .setOrigin(0, 1)
            .setScale(25);
        
        this.screenDown = this.add.image(0, this.scale.height, 'startLevelScreen')
            .setOrigin(0, 0)
            .setScale(25);

        // Stage text (hidden initially)
        this.stageText = this.add.image(centerX + STAGE_INTRO.TEXT_OFFSET_X, centerY, 'stageText')
            .setOrigin(0.5)
            .setAlpha(0);

        // Stage number using the number spritesheet
        // Position numbers after "STAGE" text
        const numberX = centerX + STAGE_INTRO.NUMBER_OFFSET_X;
        
        // Handle single or double digit stage numbers
        if (this.stageNumber >= 10) {
            // Two digit number
            const tens = Math.floor(this.stageNumber / 10);
            const ones = this.stageNumber % 10;
            
            this.stageNumberTens = this.add.sprite(numberX, centerY, 'numberSpritesheet', tens)
                .setOrigin(0.5)
                .setAlpha(0)
                .setScale(1.5)
                .setTint(0x111111);
            
            this.stageNumberOnes = this.add.sprite(numberX + STAGE_INTRO.NUMBER_SPACING, centerY, 'numberSpritesheet', ones)
                .setOrigin(0.5)
                .setAlpha(0)
                .setScale(1.5)
                .setTint(0x111111);
        } else {
            // Single digit number
            this.stageNumberOnes = this.add.sprite(numberX, centerY, 'numberSpritesheet', this.stageNumber)
                .setOrigin(0.5)
                .setAlpha(0)
                .setScale(1.5)
                .setTint(0x111111);
        }

        // Start the animation
        this.playIntroAnimation();
    }

    playIntroAnimation() {
        const centerY = this.scale.height / 2;

        // Animate screens closing in
        this.tweens.add({
            targets: this.screenUp,
            duration: STAGE_INTRO.CURTAIN_DURATION,
            y: centerY,
            ease: 'Power2',
            onComplete: () => this.showStageText()
        });

        this.tweens.add({
            targets: this.screenDown,
            duration: STAGE_INTRO.CURTAIN_DURATION,
            y: centerY,
            ease: 'Power2'
        });
    }

    showStageText() {
        // Collect all text elements to animate
        const textElements = [this.stageText, this.stageNumberOnes];
        if (this.stageNumberTens) {
            textElements.push(this.stageNumberTens);
        }

        // Fade in stage text and number
        this.tweens.add({
            targets: textElements,
            duration: STAGE_INTRO.TEXT_FADE_DURATION,
            alpha: 1
        });

        // Wait, then play jingle and transition
        this.time.delayedCall(STAGE_INTRO.TEXT_DISPLAY_TIME, () => {
            this.sound.play('start_jingle');
            
            // Wait for jingle to start, then go to gameplay
            this.time.delayedCall(STAGE_INTRO.TRANSITION_DELAY, () => {
                this.scene.start('GameplayScene', {
                    stage: this.stageNumber,
                    score: this.playerScore,
                    lives: this.playerLives
                });
            });
        });
    }
}

export { StageIntro };
