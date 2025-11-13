class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key = 'obstacle') {
        super(scene, x, y, key);

        // Añadir al scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    takeDamage(amount = 1) {
        this.health = this.health - amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}

export { Obstacle };