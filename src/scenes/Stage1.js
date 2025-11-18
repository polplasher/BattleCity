import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { ExplosionManager } from '../managers/ExplosionManager.js';

class Stage1 extends Phaser.Scene {
  constructor() { super({ key: "gameplayScene" }); }

  preload() {
    this.cameras.main.setBackgroundColor('#111');

    // Cargar sprites
    this.load.setPath('assets/sprites');
    this.load.image('obstacle', 'environment/destructible_test.png');
    this.load.spritesheet('tank', 'tanks/yellow/tank1_yellow.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bullet', 'tanks/bullet.png', { frameWidth: 8, frameHeight: 16 });

    // Sprite del enemigo de prueba (borrar luego)
    this.load.spritesheet('enemy_tank', 'tanks/red/tank1_red.png', { frameWidth: 16, frameHeight: 16 });

    // Sprite de explosión 
    this.load.spritesheet('explosion_large', 'effects/explosionLarge.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // Managers
    this.bulletManager = new BulletManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.enemyManager = new EnemyManager(this);
    this.explosionManager = new ExplosionManager(this); // Asegúrate que esté aquí

    // Bullet pool
    this.bulletPool = this.bulletManager.getPool();

    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'tank');

    //Crear obstáculos
    this.obstacleManager.createFromArray([
      { x: 100, y: 100 }, { x: 200, y: 150 },
      { x: 150, y: 200 }, { x: 300, y: 120 },
      { x: 300, y: 250 }, { x: 318, y: 233 },
      { x: 250, y: 233 }
    ]);

    // Enemigos para probar si funciona (borrar luego)
    this.enemyManager.createEnemy(100, 50);
    this.enemyManager.createEnemy(300, 200);

  // Make enemies collide with obstacles so blocked flags are useful
  this.physics.add.collider(this.enemyManager.getGroup(), this.obstacleManager.getGroup());

    // Animación de explosión
    this.anims.create({
      key: 'explosion_large_anim',
      frames: this.anims.generateFrameNumbers('explosion_large', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: 0,
      hideOnComplete: true
    });

    // Colisiones
    this.physics.add.collider(this.player, this.obstacleManager.getGroup());

    this.physics.add.overlap(this.bulletPool, this.obstacleManager.getGroup(),
      this.bulletManager.onBulletHitObstacle,
      null,
      this.bulletManager
    );

    // Colisiones enemy
    this.physics.add.collider(this.player, this.enemyManager.getGroup());
    this.physics.add.overlap(this.bulletPool, this.enemyManager.getGroup(),
      this.bulletManager.onBulletHitEnemy,
      null,
      this.bulletManager
    );
  }
}

export { Stage1 };