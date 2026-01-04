class GrassWall extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'grass_wall');
        
        scene.add.existing(this);
        
        // Set high depth to render on top of players and enemies
        this.setDepth(1000);
        
        // No physics body needed - grass is purely decorative
        this.isDestructible = false;
        this.isDestroyed = false;

        // move pivot up a bit so the wall appears higher
        this.setOrigin(0.5, 1);
        if (this.body) this.body.updateFromGameObject();
    }

    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.image('grass_wall', 'environment/grass_tile.png');
    }

    configureCellSize(size) {
        this.setDisplaySize(size, size);
    }

    // Stub methods for compatibility with obstacle system
    onHit(bullet) {
        // Grass doesn't react to bullets
    }

    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        super.destroy();
    }
}

export { GrassWall };
