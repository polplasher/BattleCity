import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { ExplosionManager } from '../managers/ExplosionManager.js';
import { GameManager } from '../managers/GameManager.js';
import { SpawnManager } from '../managers/SpawnManager.js';
import { PowerUpManager } from '../managers/PowerUpManager.js';
import { ScorePopupManager } from '../managers/ScorePopupManager.js';
import { POWERUP, GAME_SIZE } from '../core/constants.js'; // --- IMPORTANTE: Añadido GAME_SIZE

class Stage01 extends Phaser.Scene {
  constructor() { super({ key: "Stage01" }); }

  preload() {
    // Load Tiled map
    this.load.setPath('assets/tiled/maps');
    this.load.tilemapTiledJSON('stage01', 'stage01.json');
  }

  create() {
    this.cameras.main.setBackgroundColor('#111');
   
    const HUD_WIDTH = 50;
    const PLAYABLE_WIDTH = GAME_SIZE.WIDTH - HUD_WIDTH;
   
    this.physics.world.setBounds(0, 0, PLAYABLE_WIDTH, GAME_SIZE.HEIGHT);

    this.createManagers();

    // Lanzar el HUD
    this.scene.launch('HudScene');

    this.keys = this.input.keyboard.addKeys('I');

    // Load map from Tiled
    this.loadMapFromTiled();

    // Bullet pools
    this.bulletPool = this.bulletManager.getPool();
    this.enemyBulletPool = this.enemyBulletManager.getPool();

    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'tank');
    this.player.scene.bulletManager = this.bulletManager;

    // Start spawning enemies
    this.spawnManager.startLevel(1);

    this.addCollisions();
  }

  loadMapFromTiled() {
    // Create tilemap
    this.map = this.make.tilemap({ key: 'stage01' });

    // Load obstacles from object layer
    const obstaclesLayer = this.map.getObjectLayer('obstacles');

    if (!obstaclesLayer) {
      console.warn('No obstacles layer found in Tiled map');
      return;
    }

    obstaclesLayer.objects.forEach(obj => {
      // Tiled uses top-left origin, adjust if needed
      const x = obj.x + (obj.width / 2);
      const y = obj.y + (obj.height / 2);

      switch (obj.type) {
        case 'BrickWall':
          this.obstacleManager.createBrickWall(x, y);
          break;

        case 'SteelWall':
          this.obstacleManager.createSteelWall(x, y);
          break;

        case 'AllyBase':
          this.allyBase = this.obstacleManager.createAllyBase(x, y);
          break;

        default:
          console.warn(`Unknown obstacle type: ${obj.type}`);
      }
    });

    // Load powerup spawners from object layer
    this.loadPowerUpSpawners();
  }

  loadPowerUpSpawners() {
    const spawnersLayer = this.map.getObjectLayer('spawners');

    if (!spawnersLayer) {
      console.warn('No spawners layer found in Tiled map');
      return;
    }

    const spawnerPositions = [];

    spawnersLayer.objects.forEach(obj => {
      // Tiled uses top-left origin, adjust to center
      const x = obj.x + (obj.width / 2);
      const y = obj.y + (obj.height / 2);

      spawnerPositions.push({ x, y });
    });

    // Load spawner positions into PowerUpManager
    this.powerUpManager.loadSpawnerPositions(spawnerPositions);
    
    // Start automatic spawning
    this.powerUpManager.startSpawning();
  }

  createManagers() {
    this.gameManager = new GameManager(this);
    this.bulletManager = new BulletManager(this);
    this.enemyBulletManager = new BulletManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.enemyManager = new EnemyManager(this, this.enemyBulletManager);
    this.explosionManager = new ExplosionManager(this);
    this.spawnManager = new SpawnManager(this, this.enemyManager);
    this.scorePopupManager = new ScorePopupManager(this);
    this.powerUpManager = new PowerUpManager(this);
  }

  addCollisions() {
    // Player collisions
    this.physics.add.collider(this.player, this.obstacleManager.getGroup());
    this.physics.add.collider(this.player, this.enemyManager.getGroup());

    // PowerUps collision
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
    if (!this.spawnManager.isLevelActive) {
      this.registry.set('scoreSumary', this.spawnManager.scoresList ? this.spawnManager.scoresList : []);
      console.log('Final Scores List:', this.spawnManager.scoresList);
      this.scene.start("ScoreMenuScene");
    }
    if (this.keys.I.isDown) {
      this.registry.set('scoreSumary', this.spawnManager.scoresList ? this.spawnManager.scoresList : []);
      console.log('Final Scores List:', this.spawnManager.scoresList);
      this.scene.start("ScoreMenuScene");
    }
  }
}

export { Stage01 };