import { SceneManager } from "./sceneManager";

export class Window{
    private box: Phaser.GameObjects.Rectangle;

    constructor(
        readonly x: number,
        readonly y: number,
        readonly w: number,
        readonly h: number
    ){
        const layer = SceneManager.layer('dialog');
        this.box = layer.add.rectangle(x, y, w, h, 0x000088, 0.5)
            .setStrokeStyle(4, 0x080808)
            .setOrigin(0.5)
            .setDepth(0);
    }
    final(){
        this.box.destroy();
    }
}