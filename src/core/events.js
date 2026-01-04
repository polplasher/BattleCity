/**
 * Tabla centralizada de nombres de eventos del juego.
 * Evita "strings mágicos" repartidos por el código.
 */

export const EVENTS = 
{
    /**
     * Se emite cuando un enemigo muere.
     * payload: { x: number, y: number, points: number }
     */
    ENEMY_DIED: 'enemy:died',

    /**
     * Se emite cuando el jugador recibe daño.
     * payload: { amount: number }
     */
    PLAYER_DAMAGED: 'player:damaged',

    /**
     * Se emite cuando la base aliada es destruida.
     * payload: { x: number, y: number }
     */
    BASE_DESTROYED: 'base:destroyed',

    /**
     * Se emite cuando se debe crear una explosión.
     * payload: { x: number, y: number, size: string }
     */
    EXPLOSION_SPAWN: 'explosion:spawn',

    /**
     * Se emite cuando cambia el puntaje.
     * payload: { score: number }
     */
    SCORE_CHANGED: 'score:changed',

    /**
     * Se emite cuando cambian las vidas.
     * payload: { lives: number }
     */
    LIVES_CHANGED: 'lives:changed',

    /**
     * Se emite cuando se gana el juego.
     * payload: { score: number }
     */
    GAME_VICTORY: 'game:victory',

    /**
     * Se emite cuando se pierde el juego.
     * payload: { reason: string, score: number }
     */
    GAME_DEFEAT: 'game:defeat',


    POWERUP_SPAWN: 'powerup:spawn',
    POWERUP_COLLECTED: 'powerup:collected',

   
    ENEMY_REMAINING_CHANGED: 'enemy:remaining_changed'
};