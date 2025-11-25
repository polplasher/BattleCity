import { GAME_SIZE } from "../core/constants.js";

class menu extends Phaser.Scene {
  constructor() { super({ key: "menuScene" }); }


  preload() {
    this.cameras.main.setBackgroundColor('#111');
    this.load.setPath('assets/sprites');
    this.load.image('title', 'menus/titlecard.png');
    this.load.image('startLevelScreen', 'menus/greyTile.png');
    this.load.image('stageText', 'menus/stageText.png');
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
            onComplete:this.showLevelText
        });
        this.add.tween({
            targets: this.startLevelScreenDown,
            duration: 700,
            y : this.scale.height/2
            
        });
    }

    showLevelText() {
        console.log("showLevelText");
        
    }
       /*this.add.tween({
            targets: this.startLevelScreenDown,
            duration: 10,
            alpha: 1
        });*/
    

    changeScene() {
        this.scene.start("gameplayScene");
    } 

    update() {
    if (this.input.activePointer.isDown) {
        this.startGame();
    }
  }

}




export { menu };