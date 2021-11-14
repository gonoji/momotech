import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";

export class EventRoulette<T> implements GameEvent<T>{
    private message: Phaser.GameObjects.Text;
    private choice: T;
    private rolls: boolean = true;
    constructor(private generateChoice: () => T, private toText: (choice: T) => string){
    }

    init(){
        const layer = SceneManager.scene('dialog');
        this.message = layer.add.text(layer.width / 2, layer.height / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(0);
    }
    update(){
        if(this.rolls){
            this.choice = this.generateChoice();
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