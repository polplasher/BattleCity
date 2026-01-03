import { EVENTS } from '../core/events.js';
import { GAME_SIZE } from '../core/constants.js';

class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'HudScene' });
    }

    create() {
        this.HUD_WIDTH = 50; 
        this.START_X = GAME_SIZE.WIDTH - this.HUD_WIDTH; 
        this.CENTER_X = this.START_X + (this.HUD_WIDTH / 2);
        
        // 1. Fondo Gris
        const graphics = this.add.graphics();
        graphics.fillStyle(0x666666, 1); 
        graphics.fillRect(this.START_X, 0, this.HUD_WIDTH, GAME_SIZE.HEIGHT);

        // 2. Contenedor de iconos de enemigos
        this.enemyIcons = [];
        
        this.createEnemyIconsGrid(20); 

        // 3. Información del Jugador 
        
        this.add.text(this.START_X + 10, 150, 'IP', {
            fontFamily: 'monospace', 
            fontSize: '14px',
            color: '#000000',
            fontStyle: 'bold'
        });

        // Icono tanque player
        this.add.image(this.START_X + 10, 170, 'player_icon').setOrigin(0, 0.5);
        
        // Numero de vidas
        this.livesText = this.add.text(this.START_X + 25, 170, '3', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // 4. Información del Stage
        
        this.add.image(this.START_X + 10, 200, 'flag_icon').setOrigin(0, 0.5);
        
        // Numero de stage
        this.stageText = this.add.text(this.START_X + 25, 200, '1', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

       
       
        const gameScene = this.scene.get('Stage01');

        if (gameScene) {
            gameScene.events.on(EVENTS.LIVES_CHANGED, this.updateLives, this);
            gameScene.events.on(EVENTS.ENEMY_REMAINING_CHANGED, this.updateEnemyIcons, this);
            
            
        }
    }

    createEnemyIconsGrid(total) {
        // Limpiar anteriores si existen
        this.enemyIcons.forEach(icon => icon.destroy());
        this.enemyIcons = [];

        const startY = 30;
        const gapX = 8;
        const gapY = 8;
        const cols = 2;

        for (let i = 0; i < total; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Ajusteposición
            const x = (this.CENTER_X - 8) + (col * gapX);
            const y = startY + (row * gapY);

            const icon = this.add.image(x, y, 'enemy_icon');
            this.enemyIcons.push(icon);
        }
    }

    updateEnemyIcons(data) {
        const count = data.count;

       
        
        this.enemyIcons.forEach((icon, index) => {
            if (index < count) {
                icon.setVisible(true);
            } else {
                icon.setVisible(false);
            }
        });
    }

    updateLives(data) {
        this.livesText.setText(data.lives.toString());
    }
}

export { Hud };