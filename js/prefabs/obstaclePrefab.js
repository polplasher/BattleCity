class obstaclePrefab extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key = 'obstacle') {
    super(scene, x, y, key);
    
    // Añadir al scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Configurar física
    this.body.setImmovable(true); // No se mueve al chocar
    this.body.setAllowGravity(false);
    
    // Opcional: ajustar hitbox
    // this.body.setSize(16, 16);
  }

  // Método para destruir el obstáculo (si es destructible)
  takeDamage(amount = 1) {
    this.health = (this.health || 1) - amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}