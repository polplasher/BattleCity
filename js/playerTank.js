class playerTank extends Phaser.Scene{
  constructor(){ super({ key:'playerTank' }); this.facing='down'; }

  preload(){
    this.cameras.main.setBackgroundColor('#111');
    this.load.spritesheet('tank', 'assets/tanks/yellow/tank1_yellow.png', {
      frameWidth: 16, frameHeight: 16
    });
  }

  create(){
    this.anims.create({ 
      key:'tank_up',   
       frames:this.anims.generateFrameNumbers('tank',{start:0,end:1}),
        frameRate: (gamePrefs?.TANK_FR||10),
       repeat:-1 });

    this.anims.create({
       key:'tank_left', 
        frames:this.anims.generateFrameNumbers('tank',{start:2,end:3}), 
        frameRate: (gamePrefs?.TANK_FR||10), 
        repeat:-1 });

    this.anims.create({ 
      key:'tank_down',  
      frames:this.anims.generateFrameNumbers('tank',{start:4,end:5}),
       frameRate: (gamePrefs?.TANK_FR||10), 
       repeat:-1 });

    this.anims.create({
       key:'tank_right', 
       frames:this.anims.generateFrameNumbers('tank',{start:6,end:7}), 
       frameRate: (gamePrefs?.TANK_FR||10),
        repeat:-1 });

    this.hero = this.add.sprite(this.scale.width/2, this.scale.height/2, 'tank', 4).setScale(2);

   
  }

  update(){
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
  }

