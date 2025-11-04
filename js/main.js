const gamePrefs =
{
  TANK_SPEED: 60,
  TANK_FR: 10,
}

var config =
{
    type: Phaser.AUTO,
    width: 128,
    height: 256,
    // Enter scenes 
    scene: [playerTank],
    render:
    {
        pixelArt: true
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 0 },
        }
    },
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

var game = new Phaser.Game(config)