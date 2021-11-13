import { SceneManager } from "../utils/sceneManager";

export class Scene extends Phaser.Scene{
    private size: { width: number, height: number };
    constructor(readonly key: string, width?: number, height?: number){
        super({key});
        if(width && height) this.size = { width, height };
    }
    init(){
        SceneManager.init(this);
        if(!this.size){
            this.size = {
                width: Number(this.game.config.width.toString()),
                height: Number(this.game.config.height.toString())
            };
        }
        else{
            this.cameras.main.setSize(this.size.width, this.size.height);
        }
    }

    get width(){
        return this.size.width;
    }
    get height(){
        return this.size.height;
    }
}
