import { GAME_SIZE } from "../core/constants.js";

class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    create() {
        this.keys = this.input.keyboard.addKeys('W,A,S,D,ENTER');
        this.cameras.main.setBackgroundColor('#111');

        this.title = this.add.image(this.scale.width / 2, 300, 'title').setOrigin(0.5);
        this.startText = this.add.image(this.scale.width / 2, 380, '1PlayerText').setOrigin(0.5);
        this.twoPlayerText = this.add.image(this.scale.width / 2 + 5, 410, '2PlayersText').setOrigin(0.5);
        this.constructionText = this.add.image(this.scale.width / 2 + 15, 440, 'constructionText').setOrigin(0.5);

        this.HIText = this.add.image(this.scale.width / 2 - 10, 10, 'highScoreText').setOrigin(1, 0);
        this.HIScoreNumbers = this.add.sprite(this.scale.width / 2, 10, 'numberSpritesheet', 0).setFrame(1).setOrigin(1, 0);
        this.HIScore0s = this.add.sprite(this.HIScoreNumbers.x + 17, 10, '00Text', 0).setOrigin(1, 0);

        this.startLevelScreenUp = this.add.image(0, 0, 'startLevelScreen').setOrigin(0, 1).setScale(25);
        this.startLevelScreenDown = this.add.image(0, this.scale.height, 'startLevelScreen').setOrigin(0).setScale(25);
        this.levelText = this.add.image(GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT / 2, 'stageText').setOrigin(0.5).setAlpha(0);
        this.tank = this.add.sprite(this.scale.width / 2 - this.startText.width, 380, 'tank').setFrame(6);

        this.cursorPos = -1;

        this.createAnimations();

        this.tweens.add({
            targets: [this.startText, this.tank],
            duration: 3000,
            y: 150,
            yoyo: false,
            repeat: 0,
            onComplete: () => this.animateTank()
        });
        this.tweens.add({
            targets: [this.twoPlayerText],
            duration: 3000,
            y: 180,
            yoyo: false,
            repeat: 0
        });
        this.tweens.add({
            targets: [this.constructionText],
            duration: 3000,
            y: 210,
            yoyo: false,
            repeat: 0
        });
        this.tweens.add({
            targets: this.title,
            duration: 3000,
            y: 80,
            yoyo: false,
            repeat: 0
        });
    }

    createAnimations() {
        this.anims.create({
            key: "tank_anim",
            frames: this.anims.generateFrameNumbers('tank', { start: 6, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
    }

    animateTank() {
        if (this.tank && this.tank.anims) {
            this.tank.anims.play('tank_anim', true);
            this.cursorPos = 0;
        }
    }

    startGame() {
        // Go to stage intro scene which handles the animation
        this.scene.start('StageIntroScene', {
            stage: 1,
            score: 0,
            lives: 3
        });
    }

    update() {

        if (this.keys.ENTER.isDown) {
            this.startGame();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.W)) {
            this.cursorPos = (this.tank.y / 30 - 5) - 1;
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.S)) {
            this.cursorPos = (this.tank.y / 30 - 5) + 1;
        }
        this.cursorPos = Phaser.Math.Clamp(this.cursorPos, -1, 2);
        switch (this.cursorPos) {
            case 0:
                this.tank.y = 150;
                break;
            case 1:
                this.tank.y = 180;
                break;
            case 2:
                this.tank.y = 210;
                break;
            default:
                break;
        }
    }
}

export { MainMenu };