import { KeyManager } from "./keyManager";

export class SceneManager {
    private static current: Phaser.Scene;
    static init(scene: Phaser.Scene){
        this.current = scene;
        KeyManager.init(this.current);
    }
    static start(next: Function){
        if(this.current.scene.get(next.name) == null){
            this.current.scene.add(next.name, next);
        }
        this.current.scene.start(next.name);
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
