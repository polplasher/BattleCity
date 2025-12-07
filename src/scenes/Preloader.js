import { Player } from '../entities/player/Player.js';
import { Bullet } from '../entities/player/Bullet.js';
import { Explosion } from '../entities/effects/Explosion.js';
import { BrickWall } from '../environment/obstacles/BrickWall.js';
import { SteelWall } from '../environment/obstacles/SteelWall.js';
import { AllyBase } from '../environment/obstacles/allyBase.js';
import { TankBasic } from '../entities/enemies/TankBasic.js';
import { TankFast } from '../entities/enemies/TankFast.js';
import { TankPower } from '../entities/enemies/TankPower.js';
import { TankArmor } from '../entities/enemies/TankArmor.js';

/**
 * Escena de precarga global.
 * Carga todos los assets comunes del juego una sola vez.
*/
class Preloader extends Phaser.Scene {
    constructor() { super({ key: 'PreloaderScene' }); }

    preload() {
        // Crear barra de progreso (opcional pero recomendado)
        this.createLoadingBar();

        // Assets del menú
        this.load.setPath('assets/sprites');
        this.load.image('title', 'menus/text/titlecard.png');
        this.load.image('startLevelScreen', 'menus/greyTile.png');
        this.load.image('stageText', 'menus/text/stageText.png');
        this.load.image('highScoreText', 'menus/text/hiText.png');
        this.load.image('constructionText', 'menus/text/constructionText.png');
        this.load.image('1PlayerText', 'menus/text/1PlayerText.png');
        this.load.image('2PlayersText', 'menus/text/2PlayerText.png');
        this.load.image('00Text', 'menus/text/double0Text.png');
        this.load.spritesheet('numberSpritesheet', 'menus/text/numbersWhite.png', { frameWidth: 8, frameHeight: 8 });

        this.load.setPath('assets/audio');
        this.load.audio('start_jingle', 'StartLevelAudio.mp3');

        // Cargar assets de todas las entidades del juego
        Player.preload(this);
        Bullet.preload(this);
        Explosion.preload(this);

        // Obstáculos
        BrickWall.preload(this);
        SteelWall.preload(this);
        AllyBase.preload(this);

        // Enemigos
        TankBasic.preload(this);
        TankFast.preload(this);
        TankPower.preload(this);
        TankArmor.preload(this);


        //powerups
        this.load.setPath('assets/sprites/powerups'); 
        
        this.load.image('powerup_gun', 'powerUp1.png');
        this.load.image('powerup_tank', 'powerUp2.png');
        this.load.image('powerup_grenade', 'powerUp3.png');
        this.load.image('powerup_star', 'powerUp4.png');
        this.load.image('powerup_shovel', 'powerUp5.png');
        this.load.image('powerup_timer', 'powerUp6.png');
        this.load.image('powerup_helmet', 'powerUp7.png');

         this.load.setPath('assets/audio');
    this.load.audio('powerup_appear', 'Battle City SFX (14).wav');
    this.load.audio('powerup_pick', 'Battle City SFX (15).wav');

        
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Texto "Loading..."
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Barra de progreso
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // Actualizar barra con el progreso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        // Limpiar cuando termine
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        // Una vez cargado todo, ir al menú principal
        this.scene.start('MenuScene');
    }
}

export { Preloader };