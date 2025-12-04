import { SPAWN_CONFIG, LEVELS } from '../core/levels.js';

class SpawnManager {
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;
        
        this.enemyQueue = [];
        this.spawnTimer = 0;
        this.currentSpawnIndex = 0; // Para rotar posiciones 
        this.isLevelActive = false;
        this.enemiesKilled = 0; // Para saber cuándo acaba el nivel
    }

    startLevel(levelNumber) {
        const levelData = LEVELS[levelNumber];
        if (!levelData) return;

        // Copiamos la lista de enemigos
        this.enemyQueue = [...levelData.enemies];
        this.isLevelActive = true;
        this.spawnTimer = SPAWN_CONFIG.SPAWN_TIME_DELAY;
        this.enemiesKilled = 0;

        console.log(`SpawnManager: Nivel ${levelNumber} iniciado. Cola: ${this.enemyQueue.length}`);
    }

    update(time, delta) {
        if (!this.isLevelActive) return;

        // 1. Chequeo de Victoria
        if (this.enemyQueue.length === 0 && this.enemyManager.getActiveCount() === 0) {
            this.isLevelActive = false;
            console.log("SpawnManager: ¡Nivel Completado!");
            return;
        }

        // 2. Lógica de Spawn
        this.spawnTimer += delta;

        // Variables para depuración (Míralas en la consola F12)
        const activeCount = this.enemyManager.getActiveCount();
        const queueLength = this.enemyQueue.length;
        const timeCheck = this.spawnTimer > SPAWN_CONFIG.SPAWN_TIME_DELAY;
        const spaceCheck = activeCount < SPAWN_CONFIG.MAX_ENEMIES_ON_SCREEN;

      
        if (spaceCheck && queueLength > 0 && timeCheck) {
            console.log("Condiciones cumplidas. Spawneando enemigo...");
            this.spawnNext();
            this.spawnTimer = 0;
        }
    }

    spawnNext() {
        // Sacar siguiente tipo de enemigo
        const EnemyClass = this.enemyQueue.shift();

        // Obtener posición 
        const pos = SPAWN_CONFIG.POSITIONS[this.currentSpawnIndex];
        this.currentSpawnIndex = (this.currentSpawnIndex + 1) % SPAWN_CONFIG.POSITIONS.length;

        
        this.enemyManager.createEnemy(pos.x, pos.y, EnemyClass);
    }
}

export { SpawnManager };