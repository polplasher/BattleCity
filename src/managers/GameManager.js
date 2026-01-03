import { EVENTS } from '../core/events.js';
import { POWERUP, GAME_SIZE } from '../core/constants.js';
import { highScoreManager } from './HighScoreManager.js';

class GameManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.lives = 3;
        this.stage = 1;
        this.isGameOver = false;
        this.isVictory = false;
        this.baseDestroyed = false;

        // Escuchar eventos
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.scene.events.on(EVENTS.BASE_DESTROYED, this.onBaseDestroyed, this);
        this.scene.events.on(EVENTS.ENEMY_DIED, this.onEnemyDied, this);
        this.scene.events.on(EVENTS.PLAYER_DAMAGED, this.takeDamage, this);

        this.scene.events.on(EVENTS.POWERUP_COLLECTED, this.onPowerUpCollected, this);
    }

    onEnemyDied(data) {
        this.addScore(data.points);
    }

    onPowerUpCollected(data) {
        this.addScore(POWERUP.POINTS);
    }

    addScore(points) {
        if (this.isGameOver) return;
        this.score += points;
        this.scene.events.emit(EVENTS.SCORE_CHANGED, { score: this.score });
    }

    takeDamage() {
        if (this.isGameOver) return;

        this.lives--;
        console.log(`Lives left: ${this.lives}`);
        this.scene.events.emit(EVENTS.LIVES_CHANGED, { lives: this.lives });

        if (this.lives <= 0) {
            // Game Over - show animation then score screen
            this.triggerDefeat('no-lives');
        } else {
            // Player has lives left - respawn after 2 seconds
            this.respawnPlayer();
        }
    }

    respawnPlayer() {
        // Hide player temporarily and disable physics
        if (this.scene.player) {
            this.scene.player.setVisible(false);
            this.scene.player.setActive(false);
            this.scene.player.setVelocity(0, 0);

            if (this.scene.player.body) {
                this.scene.player.body.enable = false;
            }
        }

        // Respawn after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            if (this.scene.player && !this.isGameOver) {
                // Use spawn point from map, or default to bottom-center
                const spawnX = this.scene.playerSpawnX || this.scene.scale.width / 2;
                const spawnY = this.scene.playerSpawnY || this.scene.scale.height - 24;

                // Re-enable physics body first
                if (this.scene.player.body) {
                    this.scene.player.body.enable = true;
                    this.scene.player.body.reset(spawnX, spawnY);
                    this.scene.player.setVelocity(0, 0);
                }

                // Set sprite position and make visible
                this.scene.player.setPosition(spawnX, spawnY);
                this.scene.player.setActive(true);
                this.scene.player.setVisible(true);

                // Reset facing direction
                this.scene.player.facing = 'up';
                this.scene.player.setFrame(0); // Up facing frame

                // Give temporary invulnerability
                if (this.scene.player.activateShield) {
                    this.scene.player.activateShield(3000);
                }
            }
        });
    }

    heal() {
        if (this.isGameOver) return;
        this.lives++;
        this.scene.events.emit(EVENTS.LIVES_CHANGED, { lives: this.lives });
    }

    onBaseDestroyed() {
        if (this.isGameOver) return;
        this.baseDestroyed = true;
        this.triggerDefeat('base-destroyed');
    }

    checkVictory(remainingEnemies) {
        if (this.isGameOver || this.isVictory) return;

        if (remainingEnemies <= 0) {
            this.triggerVictory();
        }
    }

    triggerVictory() {
        if (this.isGameOver) return;

        this.isVictory = true;
        this.isGameOver = true;

        // Verificar si es highscore
        const isHighScore = highScoreManager.isHighScore(this.score);

        this.scene.events.emit(EVENTS.GAME_VICTORY, {
            score: this.score,
            stage: this.stage,
            isHighScore
        });

        // Opcional: cambiar a escena de victoria después de un delay
        this.scene.time.delayedCall(2000, () => {
            // this.scene.scene.start('VictoryScene', { score: this.score });
        });
    }

    triggerDefeat(reason) {
        if (this.isGameOver) return;

        this.isGameOver = true;

        // Verificar si es highscore
        const isHighScore = highScoreManager.isHighScore(this.score);

        this.scene.events.emit(EVENTS.GAME_DEFEAT, {
            reason,
            score: this.score,
            stage: this.stage,
            isHighScore
        });

        // Hide player
        if (this.scene.player) {
            this.scene.player.setVisible(false);
        }

        // Show game over animation
        this.showGameOverAnimation(reason, isHighScore);
    }

    showGameOverAnimation(reason, isHighScore) {
        const centerX = GAME_SIZE.WIDTH / 2;
        const centerY = GAME_SIZE.HEIGHT / 2;

        // Create game over text starting below screen
        const gameOverText = this.scene.add.image(centerX, GAME_SIZE.HEIGHT + 50, 'gameOverText');
        gameOverText.setDepth(1000);

        // Tween from bottom to center
        this.scene.tweens.add({
            targets: gameOverText,
            y: centerY,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Wait then go to score screen
                this.scene.time.delayedCall(2000, () => {
                    this.scene.registry.set('scoreSumary', this.scene.spawnManager.scoresList || []);
                    this.scene.scene.start('ScoreMenuScene', {
                        score: this.score,
                        stage: this.stage,
                        reason: reason,
                        isHighScore: isHighScore
                    });
                });
            }
        });
    }

    /**
     * Guarda el score actual en el ranking de highscores
     * @param {string} playerName - Nombre del jugador
     * @returns {number} Posición en el ranking (1-based) o -1 si no entró
     */
    saveHighScore(playerName) {
        return highScoreManager.addScore(playerName, this.score, this.stage);
    }

    /**
     * Obtiene los highscores
     */
    getHighScores() {
        return highScoreManager.getScores();
    }

    /**
     * Obtiene el score más alto
     */
    getTopScore() {
        return highScoreManager.getTopScore();
    }

    setStage(stage) {
        this.stage = stage;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.stage = 1;
        this.isGameOver = false;
        this.isVictory = false;
        this.baseDestroyed = false;
    }

    getLives() { return this.lives; }
    getScore() { return this.score; }
    isGameActive() { return !this.isGameOver; }
}

export { GameManager };