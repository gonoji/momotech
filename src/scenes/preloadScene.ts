import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class PreloadScene extends Phaser.Scene{
    static count : number = 0;
    constructor(){
        super({ key: 'PreloadScene' });
    }

    init(){
        SceneManager.init(this);
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        FileIO.init();
        PreloadScene.count++;
    }create(){
        if(PreloadScene.count < 3){
            SceneManager.start(PreloadScene);
        }
        else{
            SceneManager.start(TitleScene);
        }
    }
    update(){

    }

}