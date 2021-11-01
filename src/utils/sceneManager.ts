import { Scene } from "phaser";

export class SceneManager {
    public static start(sceneName:string, nowScene: Scene){
        nowScene.scene.start(sceneName);
    }
    public static set(sceneName:string, scene: Function | Phaser.Scene, nowScene: Scene){
        const nextScene = nowScene.scene.get(sceneName);
        if(nextScene == null){
            nowScene.scene.add(sceneName, scene, false);
        }
        this.start(sceneName, nowScene);
    }
}