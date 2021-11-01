import { Scene } from "phaser";
import { TitleScene } from "../scenes/titleScene";

export class SceneManager {
    static scene:Phaser.Scene;
    public static init(s:Scene):void{
        this.scene=s;
    }
    public static start(sceneName:string,nowScene :Scene){
        this.scene=nowScene;
        this.scene.scene.start(sceneName);
    }
    public static set(sceneName:string,s:Function|Phaser.Scene,nowScene: Scene){
        if(this.scene.scene.get(sceneName)==null)
            this.scene.scene.add(sceneName,s,false);
        this.start(sceneName,nowScene);
    }
}
