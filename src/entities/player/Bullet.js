class Bullet extends Phaser.GameObjects.Sprite {
  static preload(scene) {
    scene.load.setPath('assets/sprites');
    scene.load.spritesheet('bullet', 'tanks/bullet.png', { frameWidth: 8, frameHeight: 16 });

    scene.load.setPath('assets/audio');
    scene.load.audio('bullet_hit_sound', 'Battle City SFX (6).wav');
  }
  
  constructor(scene, x, y, key = 'bullet') {
    super(scene, x, y, key);
    scene.add.existing(this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const worldBounds = this.scene.physics.world.bounds;
    if (this.x < worldBounds.x || this.x > worldBounds.width ||
      this.y < worldBounds.y || this.y > worldBounds.height) {

      this.setActive(false);
      this.setVisible(false);
      if (this.body) this.body.reset(-100, -100);
    }
  }
}

export { Bullet };