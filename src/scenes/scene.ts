import { SceneManager } from "../utils/sceneManager";

export class Layer extends Phaser.Scene{
    constructor(
        readonly id: string,
        private area?: { x: number, y: number, w: number, h: number }
    ){
        super({key: id});
    }
    init(){
        console.log(`${this.id} init`);
        if(!this.area){
            this.area = {
                x: 0,
                y: 0,
                w: Number(this.game.config.width.toString()),
                h: Number(this.game.config.height.toString())
            }
        }
        else{
            this.cameras.main
                .setPosition(this.area.x, this.area.y)
                .setSize(this.area.w, this.area.h);
        }
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