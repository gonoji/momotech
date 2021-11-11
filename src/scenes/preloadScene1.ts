import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { PreloadScene2 } from "./preloadScene2";

export class PreloadScene1 extends Phaser.Scene{
    constructor(){
        super({ key: 'PreloadScene1' });
    }

    init(){
        SceneManager.init(this);
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        FileIO.init();
    }create(){

        SceneManager.start(PreloadScene2);
    }
    update(){
    }

}