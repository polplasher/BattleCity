import { BaseEnemy } from './BaseEnemy.js';
import { ENEMY } from '../../core/constants.js';

class TankArmor extends BaseEnemy {
    static preload(scene) {
        scene.load.setPath('assets/sprites');
        scene.load.spritesheet('tank_armor', 'tanks/green/tank1_green.png', { frameWidth: 16, frameHeight: 16 });
    }

    constructor(scene, x, y) {
        super(
            scene, 
            x, 
            y, 
            'tank_armor',              
            ENEMY.HEALTH_ARMOR,        
            ENEMY.POINTS_ARMOR,        
            ENEMY.SPEED_NORMAL,        
            ENEMY.BULLET_SPEED_NORMAL  
        );
    }
    
    onHealthChanged() {
       
        switch(this.health) {
            case 4: 
                this.setTint(0x00ff00); 
                break;
            case 3: 
                this.setTint(0xffff00); 
                break;
            case 2: 
                this.setTint(0xffa500); 
                break;
            case 1: 
                this.clearTint();       
                break;
        }
    }
}
export { TankArmor };