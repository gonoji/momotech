import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Depth } from "../utils/depthManager";

export class EventMessage implements GameEvent{
    private message: Phaser.GameObjects.Text;
    constructor(private text: string, private next?: GameEvent){
    }
    init(){
        this.message = SceneManager.scene.add.text(SceneManager.sceneWidth / 2, SceneManager.sceneHeight / 2, this.text, {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(Depth.of('dialog', 0));
    }
    update(){
        if(KeyManager.down('Z')) return this.next ?? 'ends';
        return 'continues';
    }
    final(){
        this.message.destroy();
    }
}