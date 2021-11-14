import { SceneManager } from "../utils/sceneManager";

export type roadType = 'tate' | 'yoko';
export class Road{
    static size: number = 64;
    private sprite: Phaser.GameObjects.Sprite;
    constructor(
        public x: number,
        public y: number,
        public roadType: roadType
    ){
        const layer = SceneManager.scene('field');
        this.sprite = layer.add.sprite(x, y,roadType).setDepth(-10);
        this.calcPosition();
    }
    private calcPosition(){
        this.sprite.x = this.x * Road.size;
        this.sprite.y = this.y * Road.size;
        this.sprite.displayWidth=Road.size;
        this.sprite.displayHeight=Road.size;
    }
    
    final(){
        this.sprite.destroy();
    }
}