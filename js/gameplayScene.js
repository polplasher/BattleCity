class gameplayScene extends Phaser.Scene {
  constructor() {
    super({ key: "playerTank" });
    this.facing = 'down';
    this.lastShot = 0;
  }

  preload() {
    this.cameras.main.setBackgroundColor('#111');

    this.load.setPath('assets/sprites');
    this.load.image('bullet', 'tanks/bullet.png');
    this.load.image('obstacle', 'environment/metalWall.png');

    // Player
    this.load.spritesheet('tank', 'tanks/yellow/tank1_yellow.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bullet', 'tanks/bullet.png', { frameWidth: 8, frameHeight: 16 });
  }

  create() {
    this.loadAnimations();

    // Tanque
    this.hero = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'tank', 4);

    // Pool de balas (enable preUpdate en el prefab)
    this.bulletPool = this.physics.add.group({ runChildUpdate: true });

    // Grupo de obstáculos
    this.obstacles = this.physics.add.group();

    // Crear algunos obstáculos de ejemplo
    this.createObstacles();

    // COLISIONES
    this.physics.add.collider(this.hero, this.obstacles); // Tank vs Obstáculos
    this.physics.add.collider(this.bulletPool, this.obstacles, this.bulletHitObstacle, null, this); // Balas vs Obstáculos


    this.input.keyboard.on('keyup-SPACE', () => this.createBullet());
  }

  createObstacles() {
    // Crear obstáculos en posiciones específicas
    const obstaclePositions = [
      { x: 100, y: 100 },
      { x: 200, y: 150 },
      { x: 150, y: 200 },
      { x: 300, y: 120 }
    ];

    obstaclePositions.forEach(pos => {
      const obstacle = new obstaclePrefab(this, pos.x, pos.y, 'obstacle');
      this.obstacles.add(obstacle);
    });
  }

  loadAnimations() {
    this.anims.create({
      key: 'tank_up',
      frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'tank_left',
      frames: this.anims.generateFrameNumbers('tank', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'tank_down',
      frames: this.anims.generateFrameNumbers('tank', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'tank_right',
      frames: this.anims.generateFrameNumbers('tank', { start: 6, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update() {
    const speed = (gamePrefs && gamePrefs.TANK_SPEED ? gamePrefs.TANK_SPEED : 60) / 60;
    const keys = this.input.keyboard.addKeys('W,A,S,D');

    if (keys.D.isDown) {
      this.hero.x += speed;
      this.hero.anims.play('tank_right', true);
      this.facing = 'right';
    } else if (keys.A.isDown) {
      this.hero.x -= speed;
      this.hero.anims.play('tank_left', true);
      this.facing = 'left';
    }
    else if (keys.W.isDown) {
      this.hero.y -= speed;
      this.hero.anims.play('tank_up', true);
      this.facing = 'up';
    }
    else if (keys.S.isDown) {
      this.hero.y += speed;
      this.hero.anims.play('tank_down', true);
      this.facing = 'down';
    }
    else {
      this.hero.anims.stop();
      this.hero.setFrame({ up: 0, left: 2, down: 4, right: 6 }[this.facing || 'down']);
    }
  }

  createBullet() {
    // Límite de balas activas (1 por poner algo)
    const activeCount = this.bulletPool.getMatching('active', true).length;
    if (activeCount >= (gamePrefs.MAX_PLAYER_BULLETS || 1)) return;

    // Cooldown
    const now = this.time.now;
    if (now - this.lastShot < (gamePrefs.FIRE_COOLDOWN || 180)) return;
    this.lastShot = now;

    const speed = (gamePrefs && gamePrefs.BULLET_SPEED) || 220;
    const offset = 12; // por delante del cañón aprox

    // Frame por dirección
    const frameByFacing = { up: 0, left: 1, down: 2, right: 3 };

    let x = this.hero.x, y = this.hero.y, vx = 0, vy = 0;
    let frame = frameByFacing[this.facing] ?? 2;

    switch (this.facing) {
      case 'up': y -= offset; vy = -speed; break;
      case 'down': y += offset; vy = speed; break;
      case 'left': x -= offset; vx = -speed; break;
      case 'right': x += offset; vx = speed; break;
      default: y += offset; vy = speed; frame = 2; break;
    }

    // Pooling
    let b = this.bulletPool.getFirst(false);
    if (!b) {
      b = new bulletPrefab(this, x, y, 'bullet');
      this.bulletPool.add(b);
    } else {
      b.setActive(true).setVisible(true);
      b.body.reset(x, y);
    }

    // Ajustes de la bala
    b.setFrame(frame).setOrigin(0.5, 0.5);
    if (b.body) {
      b.body.setAllowGravity(false);
      b.body.setSize(4, 4, true); // hitbox 4×4 (hay que ver segun las paredes)
      b.body.setVelocity(vx, vy);
    }
  }
}