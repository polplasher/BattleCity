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

    // Bullets
    BULLET_SPEED: 220,
    FIRE_COOLDOWN: 180,
    MAX_BULLETS: 1
}

// core/constants.js

export const ENEMY = {
    // Velocidades de Movimiento (pixeles por segundo)
    // Basic: "Slow"
    SPEED_SLOW: 25,
    // Power & Armor: "Normal"
    SPEED_NORMAL: 50,
    // Fast: "Fast"
    SPEED_FAST: 80,

    // Velocidades de Bala
    // Basic: "Slow"
    BULLET_SPEED_SLOW: 150,
    // Fast & Armor: "Normal"
    BULLET_SPEED_NORMAL: 220,
    // Power: "Fast"
    BULLET_SPEED_FAST: 300,

    // Salud
    HEALTH_BASIC: 1,
    HEALTH_ARMOR: 4,

    // Puntos
    POINTS_BASIC: 100,
    POINTS_FAST: 200,
    POINTS_POWER: 300,
    POINTS_ARMOR: 400,

    // Cadencia de disparo (para todos por ahora)
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