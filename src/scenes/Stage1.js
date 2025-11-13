import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';

class Stage1 extends Phaser.Scene {
  constructor() { super({ key: "gameplayScene" }); }

  preload() {
    this.cameras.main.setBackgroundColor('#111');

    // Cargar sprites
    this.load.setPath('assets/sprites');
    this.load.image('obstacle', 'environment/metalWall.png');
    this.load.spritesheet('tank', 'tanks/yellow/tank1_yellow.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bullet', 'tanks/bullet.png', { frameWidth: 8, frameHeight: 16 });
  }

  create() {
    // Managers
    this.bulletManager = new BulletManager(this);
    this.obstacleManager = new ObstacleManager(this);

    // Bullet pool
    this.bulletPool = this.bulletManager.getPool();

    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'tank');

    // Crear obstáculos
    this.obstacleManager.createFromArray([
      { x: 100, y: 100 },
      { x: 200, y: 150 },
      { x: 150, y: 200 },
      { x: 300, y: 120 }
    ]);

    // Colisiones
    this.physics.add.collider(this.player, this.obstacleManager.getGroup());
    this.physics.add.collider(this.bulletPool, this.obstacleManager.getGroup(),
      this.bulletManager.onBulletHitObstacle,
      null,
      this.bulletManager
    );
  }
}

export { Stage1 };