import { Bullet } from '../entities/player/Bullet.js';

class BulletManager {
    constructor(scene, maxFragments = 2) {
        this.scene = scene;
        this.pool = scene.physics.add.group({ runChildUpdate: true });
        this.maxFragments = maxFragments;
    }

    fire(x, y, vx, vy) {
        const bullet = this.#getBullet();
        this.#configureBullet(bullet, x, y, vx, vy);
        return bullet;
    }

    #getBullet() {
        let bullet = this.pool.getFirst(false);
        if (!bullet) {
            bullet = new Bullet(this.scene, 0, 0, 'bullet');
            this.pool.add(bullet);
        }
        return bullet;
    }

    #configureBullet(bullet, x, y, vx, vy) {
        bullet.setActive(true).setVisible(true);
        bullet.body.reset(x, y);
        bullet.setFrame(0).setOrigin(0.5, 0.5);
        
        // Rotar la bala según la dirección
        if (vx > 0) bullet.setAngle(90);      // Derecha
        else if (vx < 0) bullet.setAngle(-90); // Izquierda
        else if (vy > 0) bullet.setAngle(180); // Abajo
        else bullet.setAngle(0);               // Arriba
        
        if (bullet.body) {
            bullet.body.setAllowGravity(false);
            bullet.body.setSize(6, 6, true); // Collider más grande
            bullet.body.setVelocity(vx, vy);
        }

        bullet.fragmentsHit = 0;
        bullet.maxFragments = this.maxFragments;
        bullet.hitObstacles = new Set();
    }

    getActiveCount() { return this.pool.getMatching('active', true).length; }
    getPool() { return this.pool; }

    #canHitObstacle(bullet, obstacle) {
        return bullet.active && 
               bullet.fragmentsHit < bullet.maxFragments && 
               !bullet.hitObstacles.has(obstacle);
    }

    #deactivateBullet(bullet) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.reset(-100, -100);
        if (bullet.hitObstacles) {
            bullet.hitObstacles.clear();
        }
        this.scene.sound.play('bullet_hit_sound');
    }

    onBulletHitObstacle(bullet, obstacle) {
        if (!this.#canHitObstacle(bullet, obstacle)) return;

        // Marcar obstáculo como impactado
        bullet.hitObstacles.add(obstacle);
        
        // Aplicar daño al obstáculo
        obstacle.onHit(bullet);
        
        // Si es BrickWall, usar sistema de fragmentos
        // Si es otro tipo de obstáculo (AllyBase, SteelWall), destruir bala inmediatamente
        const isBrickWall = obstacle.texture && obstacle.texture.key === 'brick_wall';
        
        if (isBrickWall) {
            // Incrementar contador de impactos
            bullet.fragmentsHit++;
            
            // Cancelar timer previo si existe
            if (bullet.deactivateTimer) {
                bullet.deactivateTimer.destroy();
            }
            
            // Esperar al siguiente frame para permitir detectar múltiples colisiones
            bullet.deactivateTimer = this.scene.time.delayedCall(1, () => {
                if (bullet.active) {
                    this.#deactivateBullet(bullet);
                }
                bullet.deactivateTimer = null;
            });
        } else {
            // Para obstáculos no-BrickWall, destruir la bala inmediatamente
            this.#deactivateBullet(bullet);
        }
    }

    onBulletHitEnemy(bullet, enemy) {
        this.#deactivateBullet(bullet);
        enemy.takeDamage(1);
    }

    onBulletHitPlayer(obj1, obj2) {
        // Phaser might pass parameters in either order, detect which is which
        let bullet, player;
        if (obj1.texture && obj1.texture.key === 'bullet') {
            bullet = obj1;
            player = obj2;
        } else {
            bullet = obj2;
            player = obj1;
        }

        // Only process if player is active and visible
        if (!player.active || !player.visible) return;
        
        this.#deactivateBullet(bullet);
        
        if (player.takeDamage) {
            player.takeDamage();
        }
    }

    destroy() {
        // Check if pool still exists before clearing
        if (this.pool && this.pool.children) {
            this.pool.clear(true, true);
        }
        this.pool = null;
    }
}

export { BulletManager };