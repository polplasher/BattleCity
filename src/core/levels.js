
import { TankBasic } from '../entities/enemies/TankBasic.js';
import { TankFast } from '../entities/enemies/TankFast.js';
import { TankPower } from '../entities/enemies/TankPower.js';
import { TankArmor } from '../entities/enemies/TankArmor.js';

/**
 * Stage configuration - each stage has a map key and enemy list
 * The map key corresponds to the Tiled JSON file loaded in Preloader
 */
export const STAGES = {
    1: {
        mapKey: 'stage01',
        name: 'STAGE 1',
        enemies: [
            TankBasic, TankBasic, TankBasic, TankFast, 
            TankBasic, TankBasic, TankBasic, TankBasic,
            TankBasic, TankBasic, TankFast,  TankBasic,
            TankBasic, TankBasic, TankBasic, TankBasic,
            TankBasic, TankBasic
        ]
    },
    2: {
        mapKey: 'stage02',
        name: 'STAGE 2',
        enemies: [
            TankBasic, TankFast, TankFast, TankBasic,
            TankPower, TankBasic, TankFast, TankBasic,
            TankArmor, TankBasic, TankFast, TankPower,
            TankBasic, TankFast, TankArmor, TankBasic,
            TankPower, TankFast, TankBasic, TankArmor
        ]
    }
};

// Total number of stages in the game
export const TOTAL_STAGES = Object.keys(STAGES).length;

// Legacy LEVELS export for backwards compatibility
export const LEVELS = STAGES;

export const SPAWN_CONFIG = {
    MAX_ENEMIES_ON_SCREEN: 4,
    SPAWN_TIME_DELAY: 3000,
    // Fallback positions if Tiled map doesn't have spawners
    POSITIONS: [
        { x: 32, y: 32 },       
        { x: 167, y: 32 },      
        { x: 302, y: 32 }       
    ]
};