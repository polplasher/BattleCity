class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key = 'obstacle') {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    configureCellSize(size) {
        this.setDisplaySize(size, size);
        if (this.body) {
            this.body.setSize(size, size);
            this.body.updateFromGameObject();
        }
    }
}

export { Obstacle };