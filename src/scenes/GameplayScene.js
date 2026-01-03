import { BulletManager } from '../managers/BulletManager.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { Player } from '../entities/player/Player.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { ExplosionManager } from '../managers/ExplosionManager.js';
import { GameManager } from '../managers/GameManager.js';
import { SpawnManager } from '../managers/SpawnManager.js';
import { PowerUpManager } from '../managers/PowerUpManager.js';
import { ScorePopupManager } from '../managers/ScorePopupManager.js';
import { GAME_SIZE, HUD, PLAYER } from '../core/constants.js';
import { STAGES, TOTAL_STAGES } from '../core/levels.js';

/**
 * Generic gameplay scene that can load any stage.
 * Receives stage number via init() data parameter.
 */
class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }

    /**
     * Called when scene starts - receives data from previous scene
     * @param {object} data - Scene data containing stage info
     */
    init(data) {
        // Get stage number from data, default to 1
        this.currentStage = data.stage || 1;
        
        // Get accumulated score from previous stages (for multi-stage runs)
        this.accumulatedScore = data.score || 0;
        
        // Get remaining lives from previous stage
        this.initialLives = data.lives || PLAYER.INITIAL_LIVES;
        
        // Load stage configuration
        this.stageConfig = STAGES[this.currentStage];
        
        if (!this.stageConfig) {
            console.error(`Stage ${this.currentStage} not found! Falling back to stage 1`);
            this.currentStage = 1;
            this.stageConfig = STAGES[1];
        }
        
        console.log(`Initializing ${this.stageConfig.name} (Stage ${this.currentStage})`);
    }

    create() {
        this.cameras.main.setBackgroundColor('#111');

        const PLAYABLE_WIDTH = GAME_SIZE.WIDTH - HUD.WIDTH;

        this.physics.world.setBounds(0, 0, PLAYABLE_WIDTH, GAME_SIZE.HEIGHT);

        this.createManagers();

        // Set initial state from previous stage
        this.gameManager.setStage(this.currentStage);
        this.gameManager.score = this.accumulatedScore;
        this.gameManager.lives = this.initialLives;

        // Launch HUD and update it with current state
        this.scene.launch('HudScene');
        
        // Emit initial state to HUD
        this.events.emit('lives:changed', { lives: this.initialLives });
        this.events.emit('score:changed', { score: this.accumulatedScore });

        this.keys = this.input.keyboard.addKeys('I');

        // Load map from Tiled using stage config
        this.loadMapFromTiled();

        // Bullet pools
        this.bulletPool = this.bulletManager.getPool();
        this.enemyBulletPool = this.enemyBulletManager.getPool();

        // Player - use spawn point from map or default
        const spawnX = this.playerSpawnX || this.scale.width / 2;
        const spawnY = this.playerSpawnY || this.scale.height - 24;
        this.player = new Player(this, spawnX, spawnY, 'tank');
        this.player.scene.bulletManager = this.bulletManager;

        // Start spawning enemies for current stage
        this.spawnManager.startLevel(this.currentStage);

        this.addCollisions();
    }

    loadMapFromTiled() {
        // Use the map key from stage configuration
        const mapKey = this.stageConfig.mapKey;
        
        // Create tilemap
        this.map = this.make.tilemap({ key: mapKey });

        // Load player spawn point first
        this.loadPlayerSpawnPoint();

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

    loadPlayerSpawnPoint() {
        const spawnLayer = this.map.getObjectLayer('player_spawn');

        if (!spawnLayer || spawnLayer.objects.length === 0) {
            console.warn('No player_spawn layer found, using default position');
            // Default spawn position
            this.playerSpawnX = this.scale.width / 2;
            this.playerSpawnY = this.scale.height - 24;
            return;
        }

        // Get first spawn point
        const spawnObj = spawnLayer.objects[0];
        this.playerSpawnX = spawnObj.x + (spawnObj.width / 2);
        this.playerSpawnY = spawnObj.y + (spawnObj.height / 2);

        console.log(`Player spawn point: (${this.playerSpawnX}, ${this.playerSpawnY})`);
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

        // Register shutdown handler to clean up managers
        this.events.once('shutdown', this.onShutdown, this);
    }

    /**
     * Clean up managers when scene shuts down to prevent memory leaks
     * and stale event listeners
     */
    onShutdown() {
        // Clean up all managers that have destroy methods
        if (this.explosionManager) this.explosionManager.destroy();
        if (this.spawnManager) this.spawnManager.destroy();
        if (this.scorePopupManager) this.scorePopupManager.destroy();
        if (this.powerUpManager) this.powerUpManager.destroy();
        if (this.obstacleManager) this.obstacleManager.destroy();
        if (this.enemyManager) this.enemyManager.destroy();
        if (this.bulletManager) this.bulletManager.destroy();
        if (this.enemyBulletManager) this.enemyBulletManager.destroy();
        if (this.gameManager) this.gameManager.destroy();
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
            (bullet, player) => {
                // Only process collision if player is active and physics body is enabled
                return player.active && player.body && player.body.enable;
            },
            this.enemyBulletManager
        );
    }

    /**
     * Called when player completes the stage (all enemies defeated)
     */
    onStageComplete() {
        const isLastStage = this.currentStage >= TOTAL_STAGES;
        
        // Store score data for the score screen
        this.registry.set('scoreSumary', this.spawnManager.scoresList || []);
        
        // Stop HUD
        this.scene.stop('HudScene');
        
        // Go to score screen with stage completion data
        this.scene.start('ScoreMenuScene', {
            score: this.gameManager.score,
            stage: this.currentStage,
            lives: this.gameManager.lives,
            isVictory: true,
            isLastStage: isLastStage,
            reason: isLastStage ? 'game-complete' : 'stage-complete'
        });
    }

    update(time, delta) {
        this.spawnManager.update(time, delta);
        
        if (this.player) this.player.update();
        
        // Check for stage completion
        if (!this.spawnManager.isLevelActive && !this.gameManager.isGameOver) {
            this.onStageComplete();
        }
        
        // Debug: skip to score screen
        if (this.keys.I.isDown) {
            this.registry.set('scoreSumary', this.spawnManager.scoresList || []);
            this.scene.stop('HudScene');
            this.scene.start('ScoreMenuScene', {
                score: this.gameManager.score,
                stage: this.currentStage,
                lives: this.gameManager.lives,
                isVictory: true,
                isLastStage: false,
                reason: 'debug-skip'
            });
        }
    }

    /**
     * Get current stage number
     */
    getCurrentStage() {
        return this.currentStage;
    }

    /**
     * Get total number of stages
     */
    getTotalStages() {
        return TOTAL_STAGES;
    }
}

export { GameplayScene };