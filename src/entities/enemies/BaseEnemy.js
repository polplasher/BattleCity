import { ENEMY, OBSTACLE, GAME_SIZE } from '../../core/constants.js';
import { EVENTS } from '../../core/events.js';

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
        this.setImmovable(false); 
        this.body.onWorldBounds = true; // Para detectar bordes del mundo

        // IA
        this.currentDir = 'down'; 
        this.directionTimer = 0;
        this.changeDirTime = 2000; // Tiempo cambio direc
        
         // Estado interno
        this.start = true;
        this.bulletManager = null;
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
        
        // PowerUps
        this.isFrozen = false;
        this.isPowerUpCarrier = false;
        this.lastVelocity = { x: 0, y: 0 };

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
//mirar si esta quieto
        if (this.isFrozen) {
            this.body.setVelocity(0, 0);
            return;
        }

        
        this.shootTimer -= delta;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
        }

       
        this.updateMovement(delta);
    }

    updateMovement(delta) {
        // 1. Verificar colisiones 
        if (this.body.blocked.none === false || this.checkWorldBounds()) {
            this.changeDirection(true); // true = forzado por colisión
            return;
        }

        // 2. Timer para cambiar de dirección aleatoriamente 
        this.directionTimer -= delta;
        if (this.directionTimer <= 0) {
            this.changeDirection(false); // false = girar
            this.directionTimer = Phaser.Math.Between(1000, 4000);
        }

        
        this.applyVelocity();
    }

   //velocidad según direccion
    applyVelocity() {
        const speed = this.moveSpeed;
        
        switch (this.currentDir) {
            case 'up':    this.body.setVelocity(0, -speed); break;
            case 'down':  this.body.setVelocity(0, speed);  break;
            case 'left':  this.body.setVelocity(-speed, 0); break;
            case 'right': this.body.setVelocity(speed, 0);  break;
        }
        
        this.playAnimation(this.currentDir);
    }

   
    changeDirection(causedByCollision) {
        const directions = ['up', 'down', 'left', 'right'];
        let validDirections = [];

        if (causedByCollision) {
            // Si chocamos
            validDirections = directions.filter(d => d !== this.currentDir);
        } else {
            // si es por timer elegir aleatoria pero con prioridad de 90g
            validDirections = directions;
        }

        // Elegir nueva dirección aleatoria
        const newDir = Phaser.Utils.Array.GetRandom(validDirections);

        //alineamos
        if (this.isPerpendicular(this.currentDir, newDir)) {
            this.alignToGrid();
        }

        this.currentDir = newDir;
        
        // Resetear timer 
        this.directionTimer = Phaser.Math.Between(1000, 3000);
    }

   // Alinea el tanque a la rejilla para facilitar giros perfectos.
     
    alignToGrid() {
        const blockSize = OBSTACLE.BLOCK_SIZE || 16; 
        
        if (this.currentDir === 'left' || this.currentDir === 'right') {
           
            this.x = Math.round(this.x / blockSize) * blockSize; 
        } else {
            // Viceversa
            this.y = Math.round(this.y / blockSize) * blockSize;
        }
    }

    isPerpendicular(dirA, dirB) {
        const isHorizontalA = (dirA === 'left' || dirA === 'right');
        const isHorizontalB = (dirB === 'left' || dirB === 'right');
        return isHorizontalA !== isHorizontalB;
    }

    checkWorldBounds() {
        // --- CAMBIO IMPORTANTE: Usar los límites físicos dinámicos en lugar de GAME_SIZE fijo ---
        const worldBounds = this.scene.physics.world.bounds;
        
        const margin = 2;
        const x = this.x;
        const y = this.y;
        const hw = this.body.width / 2;
        const hh = this.body.height / 2;

        if (this.currentDir === 'left' && x - hw <= worldBounds.x + margin) return true;
        if (this.currentDir === 'right' && x + hw >= worldBounds.width - margin) return true; // Ahora respeta el borde del HUD
        if (this.currentDir === 'up' && y - hh <= worldBounds.y + margin) return true;
        if (this.currentDir === 'down' && y + hh >= worldBounds.height - margin) return true;
        
        return false;
    }

    
    
    shoot() {
        if (!this.bulletManager || !this.active) return;

        let vx = 0;
        let vy = 0;
        const bSpeed = this.bulletSpeed;

        switch (this.currentDir) {
            case 'up': vy = -bSpeed; break;
            case 'down': vy = bSpeed; break;
            case 'left': vx = -bSpeed; break;
            case 'right': vx = bSpeed; break;
        }

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
            const animKey = this.texture.key + '_' + direction;
            // Solo reiniciar animación si es diferente 
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== animKey || !this.anims.isPlaying) {
                this.anims.play(animKey, true);
            }
        }
    }

    takeDamage(amount = 1) {
        if (!this.active) return;
        this.health -= amount;
        this.onHealthChanged();
        if (this.health <= 0) this.die();
    }
    
    onHealthChanged() {}

    die() {
        if (!this.active) return;

        this.setActive(false);
        this.setVisible(false);
        if (this.body) this.body.enable = false;

        this.scene.events.emit(EVENTS.ENEMY_DIED, { x: this.x, y: this.y, points: this.points });
        this.scene.events.emit(EVENTS.EXPLOSION_SPAWN, { x: this.x, y: this.y });
    }

      reset(x, y) {
        this.enableBody(true, x, y, true, true);
        this.setActive(true);
        this.setVisible(true);
        
        this.health = this.initialHealth;
        this.start = true;
        this.isFrozen = false;
        this.lastVelocity = { x: 0, y: 0 }; 
        this.clearTint();
        this.onHealthChanged();
        
        this.shootTimer = Phaser.Math.Between(ENEMY.FIRE_RATE_MIN, ENEMY.FIRE_RATE_MAX);
    }
  
    freeze() {
        if (!this.active) return;
        
        // 1. Guardamos la velocidad actual ANTES de detenerlo
        this.lastVelocity = { 
            x: this.body.velocity.x, 
            y: this.body.velocity.y 
        };

        this.isFrozen = true;
        this.body.setVelocity(0, 0);
        this.anims.stop();
    }

    unfreeze() {
        if (!this.active) return;
        this.isFrozen = false;
        this.applyVelocity(); 
    }
}

export { BaseEnemy };