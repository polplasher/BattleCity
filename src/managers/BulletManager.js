import { Bullet } from '../entities/player/bullet.js';

class BulletManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = scene.physics.add.group({ runChildUpdate: true });
    }

    fire(x, y, vx, vy) {
        // Pooling
        let bullet = this.pool.getFirst(false);
        if (!bullet) {
            bullet = new Bullet(this.scene, x, y, 'bullet');
            this.pool.add(bullet);
        } else {
            bullet.setActive(true).setVisible(true);
            bullet.body.reset(x, y);
        }

        // Configurar bala
        bullet.setFrame(0).setOrigin(0.5, 0.5);
        if (bullet.body) {
            bullet.body.setAllowGravity(false);
            bullet.body.setSize(4, 4, true);
            bullet.body.setVelocity(vx, vy);
        }

        bullet.fragmentsHit = 0;
        bullet.maxFragments = 2;
        bullet.hitObstacles = new Set();

        return bullet;
    }

    getActiveCount() { return this.pool.getMatching('active', true).length; }
    getPool() { return this.pool; }

    onBulletHitObstacle(bullet, obstacle) {
        if (!bullet.active || bullet.fragmentsHit >= bullet.maxFragments) return;
        if (bullet.hitObstacles.has(obstacle)) return;

        bullet.hitObstacles.add(obstacle);
        obstacle.destroy();
        bullet.fragmentsHit++;

        if (bullet.fragmentsHit >= bullet.maxFragments) {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(-100, -100);
            bullet.hitObstacles.clear();
            this.scene.sound.play('bullet_hit_sound');
        }
    }

    onBulletHitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.reset(-100, -100);
        bullet.hitObstacles.clear();
        this.scene.sound.play('bullet_hit_sound');

        enemy.takeDamage(1);
    }
    onBulletHitPlayer(player, bullet) {

        bullet.setActive(false);
        bullet.setVisible(false);
        if (bullet.body) bullet.body.reset(-100, -100);

        if (bullet.hitObstacles) {
            bullet.hitObstacles.clear();
        }

        this.scene.sound.play('bullet_hit_sound');
        //aqui poner la logica de la bala al impactar con el player
        //player.takeDamage(1);
    }
}

export { BulletManager };