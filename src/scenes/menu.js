
class menu extends Phaser.Scene {
  constructor() { super({ key: "menuScene" }); }


  preload() {
    this.cameras.main.setBackgroundColor('#111');
    this.load.setPath('assets/sprites');
    this.load.image('title', 'menus/titlecard.png');
  }
  
  
  
  create() {
    //this.add.image(this.scale.width / 2, this.scale.height / 2, 'menuText');
    this.title = this.add.image(this.scale.width / 2, 300, 'title').setOrigin(0.5).setScale(0.5);
    this.startText = this.add.text(this.scale.width / 2, 380, 'Play', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
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

        this.add.tween({
            targets: this.startText,
            duration: 700,
            alpha: 0
        });
        this.add.tween({
            targets: this.title,
            duration: 1000,
            alpha: 0,
            onComplete:this.changeScene,
            callbackScope: this
        });
    }

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