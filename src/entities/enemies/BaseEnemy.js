import { ENEMY } from '../../core/constants.js';
import { EVENTS } from '../../core/events.js';
import { GAME_SIZE } from '../../core/constants.js';

class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, health, points, speed, bulletSpeed) {
        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Guardamos stats iniciales para poder resetear luego
        this.initialHealth = health;
        this.points = points;
        this.moveSpeed = speed;
        this.bulletSpeed = bulletSpeed;

        // Configuración física
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.setImmovable(true);
        
        // Habilitar evento de colisión con world bounds
        this.body.onWorldBounds = true;

        // Estado interno
        this.direction = -1;
        this.start = true;
        this.bulletManager = null;
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);

        this.createAnimations(textureKey);
        
        // Iniciar estado
        this.health = this.initialHealth;
        this.onHealthChanged();
    }

    setBulletManager(manager) {
        this.bulletManager = manager;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.start) {
            this.body.setVelocity(0, this.moveSpeed * this.direction);
            this.playAnimation('up');
            this.start = false;
        }

        this.colisionHandler();

        this.shootTimer -= delta;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
        }
    }

    colisionHandler() {
        // Verificación de seguridad por si el body desapareció
        if (!this.body) return;

        const blocked = this.body.blocked;
        const halfWidth = this.body.width / 2;
        const halfHeight = this.body.height / 2;
        
        // Detectar bordes de pantalla manualmente
        const atLeftEdge = this.x - halfWidth <= 0;
        const atRightEdge = this.x + halfWidth >= GAME_SIZE.WIDTH;
        const atTopEdge = this.y - halfHeight <= 0;
        const atBottomEdge = this.y + halfHeight >= GAME_SIZE.HEIGHT;
        
        // Combinar colisiones físicas con bordes de pantalla
        const blockedLeft = blocked.left || atLeftEdge;
        const blockedRight = blocked.right || atRightEdge;
        const blockedUp = blocked.up || atTopEdge;
        const blockedDown = blocked.down || atBottomEdge;
        
        if (blockedLeft || blockedRight || blockedUp || blockedDown) {
            // Obtener direcciones válidas (no bloqueadas)
            const validDirections = [];
            
            if (!blockedUp) validDirections.push('up');
            if (!blockedDown) validDirections.push('down');
            if (!blockedLeft) validDirections.push('left');
            if (!blockedRight) validDirections.push('right');
            
            // Elegir una dirección válida aleatoria
            if (validDirections.length > 0) {
                const newDir = Phaser.Utils.Array.GetRandom(validDirections);
                
                switch (newDir) {
                    case 'up':
                        this.body.setVelocity(0, -this.moveSpeed);
                        this.playAnimation('up');
                        break;
                    case 'down':
                        this.body.setVelocity(0, this.moveSpeed);
                        this.playAnimation('down');
                        break;
                    case 'left':
                        this.body.setVelocity(-this.moveSpeed, 0);
                        this.playAnimation('left');
                        break;
                    case 'right':
                        this.body.setVelocity(this.moveSpeed, 0);
                        this.playAnimation('right');
                        break;
                }
            }
        }
    }

    // ... (shoot, createAnimations, playAnimation se quedan igual) ...
    shoot() {
        if (!this.bulletManager || !this.active) return;

        let vx = 0;
        let vy = 0;
        const bSpeed = this.bulletSpeed;

        if (this.body.velocity.x > 0) vx = bSpeed;
        else if (this.body.velocity.x < 0) vx = -bSpeed;
        else if (this.body.velocity.y > 0) vy = bSpeed;
        else if (this.body.velocity.y < 0) vy = -bSpeed;
        else vy = bSpeed;

        this.bulletManager.fire(this.x, this.y, vx, vy);
    }

    createAnimations(textureKey) {
        if (this.scene.anims.exists(textureKey + '_up')) return;
        const animConfigs = [
            { suffix: '_up', start: 0, end: 1 },
            { suffix: '_left', start: 2, end: 3 },
            { suffix: '_down', start: 4, end: 5 },
            { suffix: '_right', start: 6, end: 7 }
        ];
        animConfigs.forEach(config => {
            this.scene.anims.create({
                key: textureKey + config.suffix,
                frames: this.scene.anims.generateFrameNumbers(textureKey, { start: config.start, end: config.end }),
                frameRate: 8,
                repeat: -1
            });
        });
    }

    playAnimation(direction) {
        if(this.active) {
            this.anims.play(this.texture.key + '_' + direction, true);
        }
    }

    takeDamage(amount = 1) {
        if (!this.active) return; // Evitar daño si ya está muerto

        this.health -= amount;
        this.onHealthChanged();

        if (this.health <= 0) {
            this.die();
        }
    }

    onHealthChanged() { }

    die() {
        if (!this.active) return; // Evitar doble muerte

        // 1. Desactivar inmediatamente para evitar más colisiones
        this.setActive(false);
        this.setVisible(false);
        if (this.body) this.body.enable = false; // Desactivar física explícitamente

        // 2. Emitir eventos
        this.scene.events.emit(EVENTS.ENEMY_DIED, { x: this.x, y: this.y, points: this.points });
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });
    }

    reset(x, y) {
        // Reactivar todo
        this.enableBody(true, x, y, true, true); // Método helper de Phaser para resetear body
        this.setActive(true);
        this.setVisible(true);
        
        // Restaurar estado
        this.health = this.initialHealth;
        this.start = true;
        this.clearTint();
        this.onHealthChanged();
        
        // Reiniciar timer de disparo para que no disparen todos a la vez al nacer
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
    }
}

export { BaseEnemy };