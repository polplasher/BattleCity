export const GAME_SIZE =
{
    WIDTH: 384,
    HEIGHT: 260
}

export const PHYSICS =
{
    TYPE: 'arcade',
    GRAVITY: 0,
    DEBUG: false
}

export const PLAYER =
{
    SPEED: 60,
    FRAME_RATE: 10,
    INITIAL_LIVES: 3,
    RESPAWN_DELAY: 2000,
    SHIELD_DURATION: 10000,

    // Bullets
    BULLET_SPEED: 220,
    FIRE_COOLDOWN: 180,
    MAX_BULLETS: 1
}

export const ENEMY = {
    // Velocidades de Movimiento (pixeles por segundo)
    // Basic: "Slow"
    SPEED_SLOW: 25,
    // Power & Armor: "Normal"
    SPEED_NORMAL: 35,
    // Fast: "Fast"
    SPEED_FAST: 50,

    // Velocidades de Bala
    // Basic: "Slow"
    BULLET_SPEED_SLOW: 150,
    // Fast & Armor: "Normal"
    BULLET_SPEED_NORMAL: 200,
    // Power: "Fast"
    BULLET_SPEED_FAST: 250,

    // Salud
    HEALTH_BASIC: 1,
    HEALTH_ARMOR: 4,

    // Puntos
    POINTS_BASIC: 100,
    POINTS_FAST: 200,
    POINTS_POWER: 300,
    POINTS_ARMOR: 400,

    // Cadencia de disparo
    FIRE_RATE_MIN: 1000,
    FIRE_RATE_MAX: 3000
};

export const OBSTACLE =
{
    BLOCK_SIZE: 16
}

export const RENDER =
{
    PIXEL_ART: true
}

export const SCALE =
{
    MODE: 'FIT',                // Phaser.Scale.FIT
    AUTO_CENTER: 'CENTER_BOTH', // Phaser.Scale.CENTER_BOTH
    ZOOM: 2                     //Para pixelart: escala lógica x2 sin deformar
}

export const HUD =
{
    WIDTH: 50
}

export const SCORE_POPUP =
{
    OFFSET_Y: -10,
    RISE_DISTANCE: 20,
    DURATION: 800
}

export const STAGE_INTRO =
{
    CURTAIN_DURATION: 700,
    TEXT_FADE_DURATION: 100,
    TEXT_DISPLAY_TIME: 1500,
    TRANSITION_DELAY: 500,
    NUMBER_OFFSET_X: 30,
    TEXT_OFFSET_X: -20,
    NUMBER_SPACING: 12
}

export const POWERUP = {
    
    HELMET: 'helmet',
    TIMER: 'timer',
    SHOVEL: 'shovel',
    STAR: 'star',
    GRENADE: 'grenade',
    TANK: 'tank',
    GUN: 'gun',

    
    DURATION: 10000,
    BLINK_WARNING_TIME: 3000,
    POINTS: 500,
    FREEZE_DURATION: 10000,

   
    TEXTURES: {
        'gun': 'powerup_gun',         
        'tank': 'powerup_tank',       
        'grenade': 'powerup_grenade', 
        'star': 'powerup_star',       
        'shovel': 'powerup_shovel',   
        'timer': 'powerup_timer',     
        'helmet': 'powerup_helmet'    
    }
};