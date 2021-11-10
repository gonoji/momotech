import { SceneManager } from "../utils/sceneManager";
import { Station } from "./stations/station";

export class Road{
    static size:number=Station.size;
    private sprite: Phaser.GameObjects.Sprite;
    constructor(
        public x: number,
        public y: number,
        public imageName: string
    ){
        this.sprite = SceneManager.scene.add.sprite(x, y,imageName).setDepth(-10);
        this.calcPosition();
    }
    private calcPosition(){
        this.sprite.x = this.x * Road.size;
        this.sprite.y = this.y * Road.size;
        this.sprite.displayWidth=Road.size;
        this.sprite.displayHeight=Road.size;
    }
}