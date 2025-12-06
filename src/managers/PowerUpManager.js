import { BasePowerUp } from '../entities/items/BasePowerUp.js';
import { Helmet } from '../entities/items/Helmet.js'; 
import { POWERUP } from '../core/constants.js';

class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();
    }

    spawnPowerUp(x, y, type) {
        let powerup;

       
        switch (type) {
            case POWERUP.HELMET:
                powerup = new Helmet(this.scene, x, y);
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
}

export { PowerUpManager };