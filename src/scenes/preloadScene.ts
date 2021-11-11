import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { Scene } from "./scene";
import { TitleScene } from "./titleScene";

export class PreloadScene extends Scene{
    constructor(private count: number = 0){
        super(`PreloadScene${count}`);
    }

    init(){
        SceneManager.init(this);
    }
    preload(){
        FileIO.preload(this.count);
    }
    create(){
        SceneManager.start(this.count < 3? new PreloadScene(this.count + 1) : new TitleScene());
    }
    update(){
    }
}