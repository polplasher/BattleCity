const gamePrefs =
{
    TANK_SPEED: 60,
    TANK_FR: 10,
}

var config =
{
    type: Phaser.AUTO,
    width: 384,
    height: 260,
    // Enter scenes 
    scene: [gameplayScene],
    render:
    {
        pixelArt: true
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true,
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