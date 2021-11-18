import { Game } from "../game";
import { SceneManager } from "../utils/sceneManager";

export class Layer extends Phaser.Scene{
    private area: { x: number, y: number, w: number, h: number };
    constructor(
        readonly id: string,
        area?: { x: number, y: number, w: number, h: number }
    ){
        super({key: id});
        this.area = area ?? {
            x: 0,
            y: 0,
            w: Game.width,
            h: Game.height
        };
    }
    init(){
        this.cameras.main
            .setPosition(this.area.x, this.area.y)
            .setSize(this.area.w, this.area.h);
    }

    get width(){
        return this.area.w;
    }
    get height(){
        return this.area.h;
    }
}

export class Scene extends Layer{
    init(){
        super.init();
        SceneManager.init(this);
    }
}