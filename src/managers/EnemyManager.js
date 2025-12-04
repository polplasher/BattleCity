import { TankBasic } from '../entities/enemies/TankBasic.js';

class EnemyManager {
    constructor(scene, bulletManager) {
        this.scene = scene;
        this.bulletManager = bulletManager;
        this.enemies = scene.physics.add.group({ runChildUpdate: true });
    }

    createEnemy(x, y, EnemyClass) {
      
        const ClassToUse = EnemyClass || TankBasic;
        
        const enemy = this.#getOrCreateEnemy(ClassToUse, x, y);
        this.#setupEnemy(enemy, x, y);
        return enemy;
    }

    #getOrCreateEnemy(EnemyClass, x, y) {
     
        let enemy = this.enemies.getChildren().find(e => !e.active && e instanceof EnemyClass);
        
        if (!enemy) {
            enemy = new EnemyClass(this.scene, x, y);
            this.enemies.add(enemy);
        }
        return enemy;
    }

    #setupEnemy(enemy, x, y) {
        enemy.setBulletManager(this.bulletManager);
       
        enemy.reset(x, y);
    }

    getGroup() { return this.enemies; }
    
    getActiveCount() { return this.enemies.countActive(true); }

    destroy() { this.enemies.clear(true, true); }
}

export { EnemyManager };