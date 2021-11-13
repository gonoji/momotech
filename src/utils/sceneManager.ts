import { Scene } from "../scenes/scene";
import { KeyManager } from "./keyManager";

export class SceneManager{
    private static current: Scene;
    static init(scene: Scene){
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
}
