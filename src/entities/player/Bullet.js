import { GAME_SIZE } from '../../core/constants.js';

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

    if (this.x < 0 || this.x > GAME_SIZE.WIDTH || this.y < 0 || this.y > GAME_SIZE.HEIGHT) {
      this.setActive(false);
      this.setVisible(false);
      if (this.body) this.body.reset(-100, -100);
    }
  }
}

export { Bullet };