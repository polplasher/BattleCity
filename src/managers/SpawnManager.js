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

        // Chequeo de Victoria 
        if (this.enemyQueue.length === 0 && this.enemyManager.getActiveCount() === 0) {
            this.isLevelActive = false;
            
            // this.scene.events.emit('LEVEL_COMPLETE');
            return;
        }

        // 2. Lógica de Spawn
        this.spawnTimer += delta;

        // Condiciones: Hay hueco, hay enemigos en cola, pasó el tiempo
        if (this.enemyManager.getActiveCount() < SPAWN_CONFIG.MAX_ENEMIES_ON_SCREEN && 
            this.enemyQueue.length > 0 && 
            this.spawnTimer > SPAWN_CONFIG.SPAWN_TIME_DELAY) {
            
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