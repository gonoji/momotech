import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { Window } from "../utils/window";

export class EventChoose<T extends string> implements GameEvent<T>{
    private window: Window;
    private index: number = 0;
    constructor(private readonly choices: readonly T[]){
    }
    init(){
        this.window = new Window(30, 30, 0, this.choices)
    }
    /**
     * @returns 選ばれた選択肢
     */
    update(){
        if(KeyManager.down('DOWN')) this.index = (this.index + 1) % this.choices.length;
        if(KeyManager.down('UP')) this.index = (this.index + this.choices.length - 1) % this.choices.length;
        this.window.messages.forEach(
            (message, index) => message.setColor(index == this.index? 'red': 'black')
        );
        if(KeyManager.down('Z')) return { result: this.choices[this.index] };
    }
    final(){
        this.window.final();
    }
}