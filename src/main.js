// Cargamos el Intellisense
/// <reference path="./types/phaser.d.ts" />

// Importamos la configuración del motor
import { buildConfig } from './core/config.js';

// Importamos las escenas
import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { StageIntro } from './scenes/StageIntro.js';
import { GameplayScene } from './scenes/GameplayScene.js';
import { ScoreMenu } from './scenes/ScoreMenu.js';
import { Hud } from './scenes/Hud.js'; 

const game = new Phaser.Game(
    buildConfig({
        // Orden en el que se registran/arrancan
        scenes: [
            Preloader,      // Carga todos los assets primero
            MainMenu,       // Menú principal
            StageIntro,     // Intro de stage (animación STAGE X)
            GameplayScene,  // Escena genérica de juego (carga cualquier stage)
            Hud,
            ScoreMenu       // Pantalla de puntuación
        ],
    })
);