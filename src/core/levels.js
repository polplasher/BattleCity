
import { TankBasic } from '../entities/enemies/TankBasic.js';
import { TankFast } from '../entities/enemies/TankFast.js';
import { TankPower } from '../entities/enemies/TankPower.js';
import { TankArmor } from '../entities/enemies/TankArmor.js';

export const LEVELS = {
    1: {
        
        enemies: [
            TankBasic, TankBasic, TankBasic, TankFast, 
            TankBasic, TankBasic, TankBasic, TankBasic,
            TankBasic, TankBasic, TankFast,  TankBasic,
            TankBasic, TankBasic, TankBasic, TankBasic,
            TankBasic, TankBasic
        ]
    },
    2: {
        enemies: [
            //TankBasic, TankFast, TankFast, TankBasic,...
        ]
    },
};

export const SPAWN_CONFIG = {
    MAX_ENEMIES_ON_SCREEN: 4,
    SPAWN_TIME_DELAY: 3000, 
    POSITIONS: [
        { x: 32, y: 32 },       
        { x: 192, y: 32 },      
        { x: 352, y: 32 }       
    ]
};