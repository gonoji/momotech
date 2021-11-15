import { Card } from "../gameData/cards/card";
import { Player } from "../gameData/player";
import { KeyManager } from "../utils/keyManager";
import { Window } from "../utils/window";
import { GameEvent } from "./event";

export class EventUseCard implements GameEvent<Card>{
    private window: Window;
    private index = 0;
    constructor(private readonly player: Player){
    }
    init(){
        const margin = 30;
        this.window = new Window(margin, margin, -margin, this.player.cards.map(card => card.name));
    }
    /**
     * @returns 使用するカード（使用しない場合は `null`）
     */
    update(){
        if(KeyManager.down('DOWN')) this.index = (this.index + 1) % this.player.cards.length;
        if(KeyManager.down('UP')) this.index = (this.index + this.player.cards.length - 1) % this.player.cards.length;
        this.window.messages.forEach(
            (message, index) => message.setColor(index == this.index? 'red': 'black')
        );

        if(KeyManager.down('Z')) return { result: this.player.cards[this.index] };
        if(KeyManager.down('X')) return { result: undefined };
    }
    final(){
        this.window.final();
    }
}