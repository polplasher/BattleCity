class Explosion extends Phaser.GameObjects.Sprite {
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

        this.sound.play('explosion_sound');
    }
}

export { Explosion };