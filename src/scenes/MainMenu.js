import { GAME_SIZE } from "../core/constants.js";

class MainMenu extends Phaser.Scene {
    constructor() {
         super({ key: "MenuScene" }); 
        }

    create() {
        this.keys = this.input.keyboard.addKeys('W,A,S,D,ENTER');
        this.cameras.main.setBackgroundColor('#111');
        this.title = this.add.image(this.scale.width / 2, 300, 'title').setOrigin(0.5).setScale(0.5);
        this.startText = this.add.text(this.scale.width / 2, 380, '1 Player', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
        this.twoPlayerText = this.add.text(this.scale.width / 2 + 5, 420, '2 Players', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);

        this.startLevelScreenUp = this.add.image(0, 0, 'startLevelScreen').setOrigin(0, 1).setScale(25);
        this.startLevelScreenDown = this.add.image(0, this.scale.height, 'startLevelScreen').setOrigin(0).setScale(25);
        this.levelText = this.add.image(GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT / 2, 'stageText').setOrigin(0.5).setAlpha(0);
        this.tank = this.add.sprite(this.scale.width / 2 - this.startText.width, 380, 'tank').setFrame(6);

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
        }
    }

    startGame() {
        this.startText.destroy();
        this.title.destroy();
        this.twoPlayerText.destroy();
        this.tank.destroy();
        this.tweens.add({
            targets: this.startLevelScreenUp,
            duration: 700,
            y: this.scale.height / 2,
            onComplete: () => this.showLevelText()
        });
        this.tweens.add({
            targets: this.startLevelScreenDown,
            duration: 700,
            y: this.scale.height / 2
        });
    }

    showLevelText() {
        this.tweens.add({
            targets: this.levelText,
            duration: 100,
            alpha: 1
        });
        this.tweens.add({
            targets: this.startLevelScreenUp,
            duration: 2000,
            alpha: 1,
            onComplete: () => this.changeScene()
        });
    }

    changeScene() {
        this.sound.play('start_jingle');
        this.scene.start("Stage01");
    }

    update() {
        if (this.keys.ENTER.isDown) {
            this.startGame();
        }
        if (this.keys.W.isDown) 
            this.tank.y = 150;
        if (this.keys.S.isDown) 
            this.tank.y = 180;
        
    }
}

export { MainMenu };