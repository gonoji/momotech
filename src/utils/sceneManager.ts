import { Scene } from "../scenes/scene";
import { KeyManager } from "./keyManager";

export class SceneManager {
    private static current: Phaser.Scene;
    static init(scene: Phaser.Scene){
        this.current = scene;
        KeyManager.init(this.current);
    }
    static start(next: Scene){
        if(this.current.scene.get(next.key) == null){
            this.current.scene.add(next.key, next);
        }
        this.current.scene.start(next.key);
    }
    static get scene(){
        return SceneManager.current;
    }
    static get sceneWidth(){
        return Number(this.current.game.config.width.toString());
    }
    static get sceneHeight(){
        return Number(this.current.game.config.height.toString());
    }
}
