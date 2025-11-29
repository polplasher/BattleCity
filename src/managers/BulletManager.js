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
        
        if (bullet.body) {
            bullet.body.setAllowGravity(false);
            bullet.body.setSize(4, 4, true);
            bullet.body.setVelocity(vx, vy);
        }

        bullet.fragmentsHit = 0;
        bullet.maxFragments = this.maxFragments;
        bullet.hitObstacles = new Set();
    }

    getActiveCount() { return this.pool.getMatching('active', true).length; }
    getPool() { return this.pool; }

    onBulletHitObstacle(bullet, obstacle) {
        if (!this.#canHitObstacle(bullet, obstacle)) return;

        bullet.hitObstacles.add(obstacle);
        obstacle.onHit(bullet);
        bullet.fragmentsHit++;

        if (bullet.fragmentsHit >= bullet.maxFragments) {
            this.#deactivateBullet(bullet);
        }
    }

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

    onBulletHitEnemy(bullet, enemy) {
        this.#deactivateBullet(bullet);
        enemy.takeDamage(1);
    }

    onBulletHitPlayer(bullet, player) {
        this.#deactivateBullet(bullet);
        // TODO: Descomentar cuando Player tenga método takeDamage
        // player.takeDamage(1);
    }
}

export { BulletManager };