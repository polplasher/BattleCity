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

export const ENEMY =
{
    SPEED: 10,
    // Si luego cada tipo de enemigo necesita su propia constante:
    // JUMPER_SPEED: 150,
    // SLIME_SPEED: 120
    DEFAULT_HEALTH: 2, // en verdad son todos 1 menos el blindado 

BULLET_SPEED: 160,
    FIRE_RATE_MIN: 1000,
    FIRE_RATE_MAX: 3000
}

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