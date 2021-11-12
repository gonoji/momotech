import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Depth } from "../utils/depthManager";
import { Util } from "../utils/util";

export class EventRoulette<T> implements GameEvent<T>{
    private message: Phaser.GameObjects.Text;
    private choice: T;
    private rolls: boolean = true;
    constructor(private choices: T[], private toText: (choice: T) => string){
    }

    init(){
        this.message = SceneManager.scene.add.text(SceneManager.sceneWidth / 2, SceneManager.sceneHeight / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(Depth.of('dialog', 0));
    }
    update(){
        if(this.rolls){
            this.choice = Util.pick(this.choices);
            this.message.setText(this.toText(this.choice));
        }
        if(KeyManager.down('Z')){
            if(!this.rolls) return true;
            this.rolls = false;
        }
        return false;
    }
    result(){
        return this.choice;
    }
    final(){
        this.message.destroy();
    }
}