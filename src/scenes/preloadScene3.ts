import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class PreloadScene3 extends Phaser.Scene{
    constructor(){
        super({ key: 'PreloadScene3' });
    }

    init(){
        SceneManager.init(this);
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        FileIO.init();
    }create(){

        SceneManager.start(TitleScene);
    }
    update(){
    }

}