import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";

export class EventChoose implements GameEvent<string>{
    private messages: Phaser.GameObjects.Text[];
    private index: number = 0;
    constructor(private choices: string[]){
    }
    init(){
        const layer = SceneManager.layer('dialog');
        this.messages = this.choices.map((choice, index) =>
            layer.add.text(100, 100 + 60 * index, choice, {color: 'black', fontSize: '50px'})
                .setPadding(0, 4, 0, 0)
                .setDepth(0)
        );
    }
    /**
     * @returns 選ばれた選択肢
     */
    update(){
        if(KeyManager.down('DOWN')) this.index = (this.index + 1) % this.choices.length;
        if(KeyManager.down('UP')) this.index = (this.index + this.choices.length - 1) % this.choices.length;
        this.messages.forEach((message, index) => {
            message.setColor(index == this.index? 'red': 'black');
        });
        if(KeyManager.down('Z')) return { result: this.choices[this.index] };
    }
    final(){
        for(const message of this.messages) message.destroy();
    }
    result(){
        return this.choices[this.index];
    }
}