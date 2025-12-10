class ScoreMenu extends Phaser.Scene {
    constructor() {super({ key: 'ScoreMenuScene' });}
    preload() {
        this.load.setPath('assets/sprites/tanks/grey');
        this.load.spritesheet('tank_gray_heavy', 'tank4_grey.png', { frameWidth: 16, frameHeight: 16 });
    }
    create() {
        this.cameras.main.setBackgroundColor('#111');
        this.add.text(this.scale.width / 2, 10, 'Score Menu', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
        this.add.image(this.scale.width / 2, 50, 'tank_basic');
        this.add.image(this.scale.width / 2, 100, 'tank_fast');
        this.add.image(this.scale.width / 2, 150, 'tank_power');
        this.add.image(this.scale.width / 2, 200, 'tank_gray_heavy');
    
    }

}
export { ScoreMenu };