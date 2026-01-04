import { SPAWN_CONFIG, LEVELS } from '../core/levels.js';
import { EVENTS } from '../core/events.js';

class SpawnManager {
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;
        
        this.enemyQueue = [];
        this.spawnTimer = 0;
        this.currentSpawnIndex = 0; 
        this.isLevelActive = false;
        
        this.enemiesKilledList = [];
        this.enemiesKilled = 0;
        this.totalLevelEnemies = 0; 

        this.scoresList = [];
        
        // Spawner positions loaded from Tiled map
        this.spawnerPositions = [];
        
        this.scene.events.on(EVENTS.ENEMY_DIED, this.onEnemyDied, this);
    }

    /**
     * Load spawner positions from Tiled map
     * @param {Array} positions - Array of {x, y} positions
     */
    loadSpawnerPositions(positions) {
        this.spawnerPositions = positions;
        console.log(`SpawnManager: Loaded ${positions.length} spawner positions`);
    }

    startLevel(levelNumber) {
        const levelData = LEVELS[levelNumber];
        if (!levelData) return;
    
        // Copiamos la lista de enemigos
        this.enemyQueue = [...levelData.enemies];
        
        this.totalLevelEnemies = this.enemyQueue.length;
        
        this.isLevelActive = true;
        this.spawnTimer = SPAWN_CONFIG.SPAWN_TIME_DELAY;
        this.enemiesKilled = 0;

        
        this.scene.events.emit(EVENTS.ENEMY_REMAINING_CHANGED, { 
            count: this.totalLevelEnemies 
        });

        console.log(`SpawnManager: Nivel ${levelNumber} iniciado. Total: ${this.totalLevelEnemies}`);
    }

    update(time, delta) {
        if (!this.isLevelActive) return;

        // Chequeo de Victoria
        if (this.enemyQueue.length === 0 && this.enemyManager.getActiveCount() === 0) {
            this.isLevelActive = false;
            console.log("SpawnManager: ¡Nivel Completado!");
           
            return;
        }

        // Lógica de Spawn
        this.spawnTimer += delta;

        const activeCount = this.enemyManager.getActiveCount();
        const queueLength = this.enemyQueue.length;
        const timeCheck = this.spawnTimer > SPAWN_CONFIG.SPAWN_TIME_DELAY;
        const spaceCheck = activeCount < SPAWN_CONFIG.MAX_ENEMIES_ON_SCREEN;

        if (spaceCheck && queueLength > 0 && timeCheck) {
            this.spawnNext();
            this.spawnTimer = 0;
        }
    }

    spawnNext() {
        const EnemyClass = this.enemyQueue.shift();
        
        // Use spawner positions from Tiled map, fallback to hardcoded if not loaded
        const positions = this.spawnerPositions.length > 0 
            ? this.spawnerPositions 
            : SPAWN_CONFIG.POSITIONS;
        
        const pos = positions[this.currentSpawnIndex];
        this.currentSpawnIndex = (this.currentSpawnIndex + 1) % positions.length;
        
        this.enemyManager.createEnemy(pos.x, pos.y, EnemyClass);
    }

    onEnemyDied(data) {
        if (!this.isLevelActive) return;

        this.enemiesKilled++;
        
        const score = data.points;
        
        this.scoresList.push(score);
          

        // Calculamos cuántos faltan por matar 
        const remaining = this.totalLevelEnemies - this.enemiesKilled;

        // Actualizamos el HUD para borrar un icono
        this.scene.events.emit(EVENTS.ENEMY_REMAINING_CHANGED, { 
            count: remaining 
        });
    }

    // Método para limpiar el evento si se reinicia la escena
    destroy() {
        this.scene.events.off(EVENTS.ENEMY_DIED, this.onEnemyDied, this);
    }
}

export { SpawnManager };