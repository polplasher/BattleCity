import { EVENTS } from '../core/events.js';

class GameManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.lives = 3;
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
    }

    onEnemyDied(data) {
        this.addScore(data.points);
    }

    addScore(points) {
        if (this.isGameOver) return;
        this.score += points;
        this.scene.events.emit(EVENTS.SCORE_CHANGED, { score: this.score });
    }

    takeDamage() {
        if (this.isGameOver) return;

        this.lives--;
        this.scene.events.emit(EVENTS.LIVES_CHANGED, { lives: this.lives });

        if (this.lives <= 0) {
            this.triggerDefeat('no-lives');
        }
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
        this.scene.events.emit(EVENTS.GAME_VICTORY, { score: this.score });

        // Opcional: cambiar a escena de victoria después de un delay
        this.scene.time.delayedCall(2000, () => {
            // this.scene.scene.start('VictoryScene', { score: this.score });
        });
    }

    triggerDefeat(reason) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.scene.events.emit(EVENTS.GAME_DEFEAT, { reason, score: this.score });

        // Opcional: cambiar a escena de derrota después de un delay
        this.scene.time.delayedCall(2000, () => {
            // this.scene.scene.start('GameOverScene', { score: this.score, reason });
        });
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.isVictory = false;
        this.baseDestroyed = false;
    }

    getLives() { return this.lives; }
    getScore() { return this.score; }
    isGameActive() { return !this.isGameOver; }
}

export { GameManager };