import { GAME_SIZE } from "../core/constants.js";

class menu extends Phaser.Scene {
  constructor() { super({ key: "menuScene" }); }


  preload() {
    this.cameras.main.setBackgroundColor('#111');
    this.load.setPath('assets/sprites');
    this.load.image('title', 'menus/titlecard.png');
    this.load.image('startLevelScreen', 'menus/greyTile.png');
    this.load.image('stageText', 'menus/stageText.png');


    this.load.setPath('assets/audio');
    this.load.audio('start_jingle', 'StartLevelAudio.mp3');
    this.load.audio('explosion_sound', 'Battle City SFX (7).wav');

  }
  
  
  
  create() {
    //this.add.image(this.scale.width / 2, this.scale.height / 2, 'menuText');
    this.title = this.add.image(this.scale.width / 2, 300, 'title').setOrigin(0.5).setScale(0.5);
    this.startText = this.add.text(this.scale.width / 2, 380, 'Play', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);

    this.startLevelScreenUp = this.add.image(0, 0, 'startLevelScreen').setOrigin(0, 1).setScale(25);
    this.startLevelScreenDown = this.add.image(0, this.scale.height, 'startLevelScreen').setOrigin(0).setScale(25);
    this.levelText = this.add.image(GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT / 2, 'stageText').setOrigin(0.5).setAlpha(0);
    
    //this.add.text(this.scale.width / 2 + 5, 180, '2 Players', { fontSize: '16px', fill: '#000' }).setOrigin(0.5);
    this.add.tween({
        targets: this.startText,
        duration: 3000,
        y: 150,
        yoyo: false,
        repeat: 0
    });
    this.add.tween({
        targets: this.title,
        duration: 3000,
        y: 80,
        yoyo: false,
        repeat: 0
    });
}
  
    startGame() {

        this.startText.destroy();
        this.title.destroy();
        this.add.tween({
            targets: this.startLevelScreenUp,
            duration: 700,
            y : this.scale.height/2,
            onComplete: this.showLevelText.bind(this)
        });
        this.add.tween({
            targets: this.startLevelScreenDown,
            duration: 700,
            y : this.scale.height/2
            //onComplete: this.showLevelText.bind(this)
            
        });
     
    }

    showLevelText() {
        console.log("showLevelText");
        
    
       this.add.tween({
            targets: this.levelText,
            duration: 100,
            alpha: 1
        });
        this.add.tween({
            targets: this.startLevelScreenUp,
            duration: 2000,
            alpha: 1,
            onComplete: this.changeScene.bind(this)
        });
    }
    

    changeScene() {
        this.sound.play('start_jingle');
        this.scene.start("gameplayScene");
    } 

    update() {

    if (this.input.activePointer.isDown) {
        this.startGame();

    }
  }

}




export { menu };