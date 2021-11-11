import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Depth } from "../utils/depthManager";

export class EventRoulette implements GameEvent<string>{
    private message: Phaser.GameObjects.Text;
    private choice: string;
    private rolls: boolean = true;
    constructor(private choices: string[]){
    }

    init(){
        this.message = SceneManager.scene.add.text(SceneManager.sceneWidth / 2, SceneManager.sceneHeight / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(Depth.of('dialog', 0));
    }
    update(){
        if(this.rolls){
            this.choice = this.choices[Math.floor(Math.random()*this.choices.length)];
            this.message.setText(this.choice);
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