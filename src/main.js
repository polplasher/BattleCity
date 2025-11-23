// Cargamos el Intellisense
/// <reference path="./types/phaser.d.ts" />

// Importamos la configuración del motor
import { buildConfig } from './core/config.js';
import { menu } from './scenes/menu.js';

// Importamos las escenas
import { Stage1 } from './scenes/Stage1.js';
//import { Level2 } from './scenes/Level2.js';
//import { Hud } from './scenes/Hud.js';

const game = new Phaser.Game
(
    buildConfig({
    // Orden en el que se registran/arrancan
    scenes: [
      menu,// Boot,    // si hay una escena de precarga
      Stage1
      // Hud     // si se lanza luego en paralelo (ya lo veremos)
    ],
  })
);

/*
const gamePrefs =
{
    // Tank
    TANK_SPEED: 60,
    TANK_FRAME_RATE: 10,

    // Bullets
    BULLET_SPEED: 220,
    MAX_PLAYER_BULLETS: 1,
    FIRE_COOLDOWN: 180,
}

var config =
{
    type: Phaser.AUTO,
    width: 384,
    height: 260,
    // Enter scenes 
    scene: [Stage1],
    render:
    {
        pixelArt: true
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true,
            gravity: { y: 0 },
        }
    },
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}
*/