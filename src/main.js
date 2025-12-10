// Cargamos el Intellisense
/// <reference path="./types/phaser.d.ts" />

// Importamos la configuración del motor
import { buildConfig } from './core/config.js';

// Importamos las escenas
import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { Stage01 } from './scenes/Stage01.js';
import { ScoreMenu } from './scenes/ScoreMenu.js';

const game = new Phaser.Game(
    buildConfig({
        // Orden en el que se registran/arrancan
        scenes: [
            Preloader,  // Carga todos los assets primero
            MainMenu,   // Menú principal
            Stage01,    // Nivel 1
            ScoreMenu   // Pantalla de puntuación
            // Hud     // si se lanza luego en paralelo (ya lo veremos)
        ],
    })
);