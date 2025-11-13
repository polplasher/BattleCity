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

        return bullet;
    }

    getActiveCount() { return this.pool.getMatching('active', true).length; }
    getPool() { return this.pool; }

    onBulletHitObstacle(bullet, obstacle) {
        bullet.setActive(false);
        bullet.setVisible(false);
        if (bullet.body) bullet.body.reset(-100, -100);
        // obstacle.takeDamage(1);
    }
}

export { BulletManager };