
class menu extends Phaser.Scene {
  constructor() { super({ key: "menuScene" }); }


  preload() {
    this.cameras.main.setBackgroundColor('#666');
    this.load.setPath('assets/sprites');
    this.load.image('menuText', 'ui/menu_text.png');
  }
  
  
  
  create() {
    //this.add.image(this.scale.width / 2, this.scale.height / 2, 'menuText');
    this.title =this.add.text(this.scale.width / 2, 100, 'Battle City', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
    this.startText = this.add.text(this.scale.width / 2, 150, 'Play', { fontSize: '16px', fill: '#000' }).setOrigin(0.5);
    //this.add.text(this.scale.width / 2 + 5, 180, '2 Players', { fontSize: '16px', fill: '#000' }).setOrigin(0.5);

}
  
    startGame() {
        this.add.tween({
            targets: this.title,
            duration: 500,
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