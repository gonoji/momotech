import { Event } from "./event";
import { KeyManager } from "../utils/keyManager";
import { EventManager } from "./eventManager";

export class EventChoose implements Event{
    private choices: { name: string, event: Event }[];
    private messages: Phaser.GameObjects.Text[];
    private index: number;
    
    constructor(){
        this.choices = [];
        this.index = 0;
    }
    init(){
        this.messages = this.choices.map((choice, index) =>
            EventManager.scene.add.text(100, 100 + 60 * index, choice.name, {color: 'black', fontSize: '50px'}).setPadding(0, 4, 0, 0)
        );
    }
    update(){
        if(KeyManager.down('DOWN')) this.index = (this.index + 1) % this.choices.length;
        if(KeyManager.down('UP')) this.index = (this.index + this.choices.length - 1) % this.choices.length;
        if(KeyManager.down('Z')){
            return this.choices[this.index].event;
        }
        this.messages.forEach((message, index) => {
            message.setColor(index == this.index? 'red': 'black');
        });
        return 'continues';
    }
    final(){
        for(const message of this.messages) message.destroy();
    }
    setChoice(name: string, event: Event){
        this.choices.push({name, event});
        return this;
    }
}