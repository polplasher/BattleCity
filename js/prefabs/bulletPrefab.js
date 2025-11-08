class bulletPrefab extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key = 'bullet') {
    super(scene, x, y, key);
    scene.add.existing(this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.x < 0 || this.x > config.width || this.y < 0 || this.y > config.height) {
      this.setActive(false);
      this.setVisible(false);
      if (this.body) this.body.reset(-100, -100);
    }
  }
}