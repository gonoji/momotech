import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Depth } from "../utils/depthManager";

export class EventChoose implements GameEvent<string>{
    private messages: Phaser.GameObjects.Text[];
    private index: number = 0;
    constructor(private choices: string[]){
    }
    init(){
        const layer = SceneManager.scene('dialog');
        this.messages = this.choices.map((choice, index) =>
            layer.add.text(100, 100 + 60 * index, choice, {color: 'black', fontSize: '50px'})
                .setPadding(0, 4, 0, 0)
                .setDepth(0)
        );
    }
    update(){
        if(KeyManager.down('DOWN')) this.index = (this.index + 1) % this.choices.length;
        if(KeyManager.down('UP')) this.index = (this.index + this.choices.length - 1) % this.choices.length;
        this.messages.forEach((message, index) => {
            message.setColor(index == this.index? 'red': 'black');
        });
        return KeyManager.down('Z');
    }
    final(){
        for(const message of this.messages) message.destroy();
    }
    result(){
        return this.choices[this.index];
    }
}