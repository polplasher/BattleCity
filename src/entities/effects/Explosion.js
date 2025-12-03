class Explosion extends Phaser.GameObjects.Sprite {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('explosion_large', 'effects/explosionLarge.png', { frameWidth: 32, frameHeight: 32 });
        
        scene.load.setPath('assets/audio');
        scene.load.audio('explosion_sound', 'Battle City SFX (7).wav');
    }

    constructor(scene, x, y, key = 'explosion_large') {
        super(scene, x, y, key);
        scene.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setActive(false);
            this.setVisible(false);
        }, scene);
    }

    spawn(x, y, animKey = 'explosion_large_anim') {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

        this.anims.play(animKey);

        this.scene.sound.play('explosion_sound');
    }
}

export { Explosion };