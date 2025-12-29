class BaseObstacle extends Phaser.Physics.Arcade.Sprite {
    static preload(scene) { }

    constructor(scene, x, y, textureKey, config = {}) {
        super(scene, x, y, textureKey, config.frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.isDestructible = config.isDestructible ?? true;
        this.isDestroyed = false;
    }

    configureCellSize(size) {
        this.setDisplaySize(size, size);
        if (this.body) {
            this.body.setSize(size, size);
            this.body.updateFromGameObject();
        }
    }

    onHit(bullet) {
        if (this.isDestructible && !this.isDestroyed) {
            this.destroy();
        }
    }

    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        super.destroy();
    }
}

export { BaseObstacle };