import { BasePowerUp } from '../entities/items/BasePowerUp.js';
import { Helmet } from '../entities/items/Helmet.js'; 
import { TankItem } from '../entities/items/TankItem.js';
import { Grenade } from '../entities/items/Grenade.js'; 
import { Timer } from '../entities/items/Timer.js';
import { POWERUP } from '../core/constants.js';

class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();
        
        // Spawner system
        this.spawnerPositions = [];
        this.spawnTimer = null;
        this.isActive = false;
        this.minSpawnInterval = 5000;  // Minimum 5 seconds
        this.maxSpawnInterval = 15000; // Maximum 15 seconds
    }

    spawnPowerUp(x, y, type) {
        let powerup;

        switch (type) {
            case POWERUP.HELMET:
                powerup = new Helmet(this.scene, x, y);
                break;
            
            case POWERUP.TANK:
                powerup = new TankItem(this.scene, x, y);
                break;

           
            case POWERUP.GRENADE: 
            case 'grenade':      
                powerup = new Grenade(this.scene, x, y);
                break;
                case POWERUP.TIMER:
            case 'timer':
                powerup = new Timer(this.scene, x, y);
                break;  

            default:
                console.warn(`Clase para ${type} no implementada, usando BasePowerUp genérico.`);
                powerup = new BasePowerUp(this.scene, x, y, type);
                break;
        }

        this.group.add(powerup);
        return powerup;
    }

    spawnRandomPowerUp(x, y) {
        const types = Object.keys(POWERUP.TEXTURES);
        const randomType = Phaser.Utils.Array.GetRandom(types);
        this.spawnPowerUp(x, y, randomType);
    }

    setupCollision(player) {
        this.scene.physics.add.overlap(player, this.group, (p, powerup) => {
            powerup.collect(p);
        });
    }

    /**
     * Load spawner positions from Tiled map
     * @param {Array} positions - Array of {x, y} positions
     */
    loadSpawnerPositions(positions) {
        this.spawnerPositions = positions;
        console.log(`PowerUpManager: Loaded ${positions.length} spawner positions`);
    }

    /**
     * Start automatic powerup spawning
     */
    startSpawning() {
        if (this.spawnerPositions.length === 0) {
            console.warn('PowerUpManager: No spawner positions loaded!');
            return;
        }

        this.isActive = true;
        this.scheduleNextSpawn();
    }

    /**
     * Stop automatic powerup spawning
     */
    stopSpawning() {
        this.isActive = false;
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
    }

    /**
     * Schedule the next powerup spawn with a random interval
     */
    scheduleNextSpawn() {
        if (!this.isActive) return;

        const interval = Phaser.Math.Between(this.minSpawnInterval, this.maxSpawnInterval);
        
        this.spawnTimer = this.scene.time.delayedCall(interval, () => {
            this.spawnAtRandomLocation();
            this.scheduleNextSpawn(); // Schedule the next one
        });
    }

    /**
     * Spawn a random powerup at a random spawner location
     */
    spawnAtRandomLocation() {
        if (this.spawnerPositions.length === 0) return;

        // Get a random spawner position
        const pos = Phaser.Utils.Array.GetRandom(this.spawnerPositions);
        
        // Spawn a random powerup
        this.spawnRandomPowerUp(pos.x, pos.y);
    }

    /**
     * Clean up when scene is destroyed
     */
    destroy() {
        this.stopSpawning();
        this.group.clear(true, true);
        this.spawnerPositions = [];
    }
}

export { PowerUpManager };