import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { ExplosionManager } from '../managers/ExplosionManager.js';
import { GameStateManager } from '../managers/GameManager.js';

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

    // Audios
    this.load.setPath('assets/audio');
    this.load.audio('explosion_sound', 'Battle City SFX (7).wav');
    this.load.audio('bullet_hit_sound', 'Battle City SFX (6).wav');
  }

  create() {
    this.createManagers();

    // Bullet pool
    this.bulletPool = this.bulletManager.getPool();
    this.enemyBulletPool = this.enemyBulletManager.getPool();

    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'tank');
    this.player.scene.bulletManager = this.bulletManager;

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

    // Animación de explosión
    this.anims.create({
      key: 'explosion_large_anim',
      frames: this.anims.generateFrameNumbers('explosion_large', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: 0,
      hideOnComplete: true
    });

    this.addCollisions();
  }

  createManagers() {
    this.gameStateManager = new GameStateManager(this);
    this.bulletManager = new BulletManager(this);
    this.enemyBulletManager = new BulletManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.enemyManager = new EnemyManager(this, this.enemyBulletManager);
    this.explosionManager = new ExplosionManager(this);
  }

  addCollisions() {
    // Player collisions
    this.physics.add.collider(this.player, this.obstacleManager.getGroup());
    this.physics.add.collider(this.player, this.enemyManager.getGroup());

    // Player bullet collisions
    this.physics.add.overlap(this.bulletPool, this.enemyManager.getGroup(),
      this.bulletManager.onBulletHitEnemy,
      null,
      this.bulletManager
    );
    this.physics.add.overlap(this.bulletPool, this.obstacleManager.getGroup(),
      this.bulletManager.onBulletHitObstacle,
      null,
      this.bulletManager
    );

    // Enemy collisions
    this.physics.add.collider(this.enemyManager.getGroup(), this.obstacleManager.getGroup());

    // Enemy bullet collisions
    this.physics.add.overlap(this.enemyBulletPool, this.obstacleManager.getGroup(),
      this.enemyBulletManager.onBulletHitObstacle,
      null,
      this.enemyBulletManager
    );
    this.physics.add.overlap(this.enemyBulletPool, this.player,
      this.enemyBulletManager.onBulletHitPlayer,
      null,
      this.enemyBulletManager
    );
  }
}

export { Stage1 };