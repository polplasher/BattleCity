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

        // Crear animación si no existe
        this.createAnimation();

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setActive(false);
            this.setVisible(false);
        }, scene);
    }

    createAnimation() {
        // Solo crear si no existe
        if (this.scene.anims.exists('explosion_large_anim')) return;

        this.scene.anims.create({
            key: 'explosion_large_anim',
            frames: this.scene.anims.generateFrameNumbers('explosion_large', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
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