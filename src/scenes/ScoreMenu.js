class ScoreMenu extends Phaser.Scene {
    constructor() {super({ key: 'ScoreMenuScene' });}
    preload() {
        this.load.setPath('assets/sprites/tanks/grey');
        this.load.spritesheet('tank_gray_heavy', 'tank4_grey.png', { frameWidth: 16, frameHeight: 16 });
        this.basicDefeated = 22;
        this.fastDefeated = 4;
        this.powerDefeated = 2;
        this.heavyDefeated = 2;
    }
    create() {
        this.cameras.main.setBackgroundColor('#111');
        this.add.text(this.scale.width / 2, 10, 'Score Menu', { fontSize: '16px', fill: '#ddd' }).setOrigin(0.5);
        
        this.add.sprite(this.scale.width / 2 - 5, 70, 'numberSpritesheet', Math.floor(this.basicDefeated/10));
        this.add.sprite(this.scale.width / 2 + 5, 70, 'numberSpritesheet', this.basicDefeated%10);
        this.add.image(this.scale.width / 2, 50, 'tank_basic');

        this.add.sprite(this.scale.width / 2 - 5, 120, 'numberSpritesheet', Math.floor(this.fastDefeated/10));
        this.add.sprite(this.scale.width / 2 + 5, 120, 'numberSpritesheet', this.fastDefeated%10);
        this.add.image(this.scale.width / 2, 100, 'tank_fast');

        this.add.sprite(this.scale.width / 2 - 5, 170, 'numberSpritesheet', Math.floor(this.powerDefeated/10));
        this.add.sprite(this.scale.width / 2 + 5, 170, 'numberSpritesheet', this.powerDefeated%10);
        this.add.image(this.scale.width / 2, 150, 'tank_power');

        this.add.sprite(this.scale.width / 2 - 5, 220, 'numberSpritesheet', Math.floor(this.heavyDefeated/10));
        this.add.sprite(this.scale.width / 2 + 5, 220, 'numberSpritesheet', this.heavyDefeated%10);
        this.add.image(this.scale.width / 2, 200, 'tank_gray_heavy');
    
    }

}
export { ScoreMenu };