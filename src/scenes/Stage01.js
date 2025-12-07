import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { ExplosionManager } from '../managers/ExplosionManager.js';
import { GameManager } from '../managers/GameManager.js';
import { SpawnManager } from '../managers/SpawnManager.js';
import { PowerUpManager } from '../managers/PowerUpManager.js';
import { POWERUP } from '../core/constants.js';

class Stage01 extends Phaser.Scene {
  constructor() { super({ key: "Stage01" }); }

  create() {
    this.cameras.main.setBackgroundColor('#111');
    this.createManagers();

    this.spawnManager.startLevel(1);

    // Bullet pool
    this.bulletPool = this.bulletManager.getPool();
    this.enemyBulletPool = this.enemyBulletManager.getPool();

    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'tank');
    this.player.scene.bulletManager = this.bulletManager;

    // Base aliada (se añade al grupo de obstáculos)
    this.allyBase = this.obstacleManager.createAllyBase(this.scale.width / 2, this.scale.height - 30);

    // Crear obstáculos. Se hará desde Tiled más adelante
    this.obstacleManager.createFromArray([
      { x: 100, y: 100 }, { x: 200, y: 150 },
      { x: 150, y: 200 }, { x: 300, y: 120 },
      { x: 300, y: 250 }, { x: 318, y: 233 },
      { x: 250, y: 233 }
    ]);

    //Para probar powerup helmet
    this.time.delayedCall(2000, () => {
        this.powerUpManager.spawnPowerUp(200, 200, POWERUP.HELMET);
        console.log("Stage01: PowerUp Helmet spawneado para prueba");
    });

    this.addCollisions();
  }

  createManagers() {
    this.gameManager = new GameManager(this);
    this.bulletManager = new BulletManager(this);
    this.enemyBulletManager = new BulletManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.enemyManager = new EnemyManager(this, this.enemyBulletManager);
    this.explosionManager = new ExplosionManager(this);
    this.spawnManager = new SpawnManager(this, this.enemyManager);
    
    // Inicializar el Manager de PowerUps
    this.powerUpManager = new PowerUpManager(this);
  }

  addCollisions() {
    // Player collisions
    this.physics.add.collider(this.player, this.obstacleManager.getGroup());
    this.physics.add.collider(this.player, this.enemyManager.getGroup());

    //PowerUps collision
    this.powerUpManager.setupCollision(this.player);

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

 update(time, delta) {
    this.spawnManager.update(time, delta);
    if (this.player) this.player.update();
  }
}

export { Stage01 };