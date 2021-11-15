import { Card } from "../gameData/cards/card";
import { Player } from "../gameData/player";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

export class EventUseCard implements GameEvent<Card>{

    constructor(private readonly player: Player){
    }
    init(){
    }
    /**
     * @returns 使用するカード（使用しない場合は `null`）
     */
    update(){
        if(KeyManager.down('Z')) return { result: this.player.cards[0] } // 仮
        if(KeyManager.down('X')) return { result: undefined };
    }
    final(){
    }
}