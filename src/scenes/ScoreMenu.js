class ScoreMenu extends Phaser.Scene {
    constructor() {
        super({ key: "ScoreMenuScene" });
    }
    create() {
        this.cameras.main.setBackgroundColor('#111');
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Score Menu', { fontSize: '32px', fill: '#ddd' }).setOrigin(0.5);
    }

}
export { ScoreMenu };