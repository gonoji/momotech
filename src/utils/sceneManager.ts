import { KeyManager } from "./keymanager";

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
}
