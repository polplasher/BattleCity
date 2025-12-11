const STORAGE_KEY = 'battlecity_highscores';
const MAX_SCORES = 10;

class HighScoreManager {
    constructor() {
        this.scores = this.#loadScores();
    }

    #loadScores() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('Error loading highscores:', e);
            return [];
        }
    }

    #saveScores() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores));
        } catch (e) {
            console.warn('Error saving highscores:', e);
        }
    }

    /**
     * Añade un nuevo score y devuelve la posición (1-based) o -1 si no entró en el ranking
     */
    addScore(playerName, score, stage = 1) {
        const entry = {
            name: playerName.substring(0, 10).toUpperCase(), // Máximo 10 caracteres
            score: score,
            stage: stage,
            date: Date.now()
        };

        // Insertar en la posición correcta (ordenado de mayor a menor)
        let position = this.scores.findIndex(s => score > s.score);

        if (position === -1) {
            // No es mayor que ninguno, añadir al final si hay espacio
            if (this.scores.length < MAX_SCORES) {
                position = this.scores.length;
                this.scores.push(entry);
            } else {
                return -1; // No entró en el ranking
            }
        } else {
            this.scores.splice(position, 0, entry);
        }

        // Mantener solo los top MAX_SCORES
        if (this.scores.length > MAX_SCORES) {
            this.scores = this.scores.slice(0, MAX_SCORES);
        }

        this.#saveScores();
        return position + 1; // Posición 1-based
    }

    /**
     * Verifica si un score entraría en el ranking
     */
    isHighScore(score) {
        if (this.scores.length < MAX_SCORES) return true;
        return score > this.scores[this.scores.length - 1].score;
    }

    /**
     * Obtiene todos los highscores
     */
    getScores() {
        return [...this.scores];
    }

    /**
     * Obtiene el highscore más alto
     */
    getTopScore() {
        return this.scores.length > 0 ? this.scores[0].score : 0;
    }

    /**
     * Limpia todos los highscores
     */
    clearScores() {
        this.scores = [];
        this.#saveScores();
    }
}

// Singleton para acceso global
const highScoreManager = new HighScoreManager();

export { HighScoreManager, highScoreManager };
