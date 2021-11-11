import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { PreloadScene3 } from "./preloadScene3";

export class PreloadScene2 extends Phaser.Scene{
    constructor(){
        super({ key: 'PreloadScene2' });
    }

    init(){
        SceneManager.init(this);
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        FileIO.init();
    }create(){
        SceneManager.start(PreloadScene3);
    }
    update(){
    }

}