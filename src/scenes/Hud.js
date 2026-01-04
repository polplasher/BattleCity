import { EVENTS } from '../core/events.js';
import { GAME_SIZE, HUD, PLAYABLE_AREA } from '../core/constants.js';

class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'HudScene' });
    }

    create() {
        this.HUD_WIDTH = HUD.WIDTH;
        this.START_X = GAME_SIZE.WIDTH - this.HUD_WIDTH;
        this.CENTER_X = this.START_X + (this.HUD_WIDTH / 2);

        // Calculate playable area position (same as GameplayScene)
        const availableWidth = GAME_SIZE.WIDTH - HUD.WIDTH;
        const availableHeight = GAME_SIZE.HEIGHT;
        const playableX = Math.floor((availableWidth - PLAYABLE_AREA.WIDTH) / 2) + PLAYABLE_AREA.OFFSET_X;
        const playableY = Math.floor((availableHeight - PLAYABLE_AREA.HEIGHT) / 2) + PLAYABLE_AREA.OFFSET_Y;

        const graphics = this.add.graphics();
        graphics.fillStyle(0x666666, 1);

        // HUD background (right side)
        graphics.fillRect(this.START_X, 0, this.HUD_WIDTH, GAME_SIZE.HEIGHT);

        // Border around the playable area
        const borderSize = PLAYABLE_AREA.BORDER_SIZE;

        // Top border
        graphics.fillRect(0, 0, this.START_X, playableY);

        // Bottom border  
        graphics.fillRect(0, playableY + PLAYABLE_AREA.HEIGHT, this.START_X, GAME_SIZE.HEIGHT - playableY - PLAYABLE_AREA.HEIGHT);

        // Left border
        graphics.fillRect(0, playableY, playableX, PLAYABLE_AREA.HEIGHT);

        // Right border (between playable area and HUD)
        graphics.fillRect(playableX + PLAYABLE_AREA.WIDTH, playableY, this.START_X - playableX - PLAYABLE_AREA.WIDTH, PLAYABLE_AREA.HEIGHT);

        // 2. Contenedor de iconos de enemigos
        this.enemyIcons = [];

        this.createEnemyIconsGrid(20);

        // Icono tanque player
        this.add.image(this.CENTER_X - 8, 170, 'player_icon').setOrigin(0.5, 0.5);

        // Numero de vidas (using sprite numbers)
        this.livesSprite = this.add.sprite(this.CENTER_X + 5, 171, 'numberSpritesheet', 3).setOrigin(0.5, 0.5).setTint("#111");

        // 4. Información del Stage
        this.add.image(this.CENTER_X - 8, 200, 'flag_icon').setOrigin(0.5, 0.5);

        // Numero de stage (using sprite numbers)
        this.stageSprite = this.add.sprite(this.CENTER_X + 5, 200, 'numberSpritesheet', 1).setOrigin(0.5, 0.5).setTint("#111");

        const gameScene = this.scene.get('GameplayScene');

        if (gameScene) {
            // Escuchar eventos
            gameScene.events.on(EVENTS.LIVES_CHANGED, this.updateLives, this);
            gameScene.events.on(EVENTS.ENEMY_REMAINING_CHANGED, this.updateEnemyIcons, this);

            // Sincronización Inicial Manual 
            if (gameScene.spawnManager) {
                const total = gameScene.spawnManager.totalLevelEnemies;
                const killed = gameScene.spawnManager.enemiesKilled;
                const remaining = total - killed;

                // Forzamos la actualización visual inmediata
                this.updateEnemyIcons({ count: remaining });
            }

            // Actualizar vidas iniciales
            if (gameScene.gameManager) {
                this.updateLives({ lives: gameScene.gameManager.lives });
            }

            // Actualizar número de stage
            if (gameScene.currentStage) {
                this.stageSprite.setFrame(gameScene.currentStage);
            }
        }
    }

    createEnemyIconsGrid(total) {

        this.enemyIcons.forEach(icon => icon.destroy());
        this.enemyIcons = [];

        const startY = 30;
        const gapX = 8;
        const gapY = 8;
        const cols = 2;

        for (let i = 0; i < total; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Ajuste posición
            const x = (this.CENTER_X - 8) + (col * gapX);
            const y = startY + (row * gapY);

            const icon = this.add.image(x, y, 'enemy_icon');

            icon.setVisible(false);
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
        this.livesSprite.setFrame(data.lives);
    }
}

export { Hud };