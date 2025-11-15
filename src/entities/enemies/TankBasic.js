//para probar si funciona el sistema de vidas y explosion
import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankBasic extends BaseEnemy {
    constructor(scene, x, y) {
        const key = 'enemy_tank';
        const health = ENEMY.DEFAULT_HEALTH;

        super(scene, x, y, key, health);

        // Aquí se podrá poner su velocidad, IA, etc.
    }


    reset(x, y) {
        super.reset(x, y);
    }
}

export { TankBasic };