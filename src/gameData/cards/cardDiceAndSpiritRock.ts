import { GameData } from "../gameData";
import { Card } from "./card";
import { GameEvent } from "../../events/event";
import { Station } from "../stations/station";
import { EventMessage } from "../../events/eventMessage";
import { RoutineDice } from "../../routines/routines";

export class CardDiceAndSpiritRock extends Card{
    *routine(data: GameData){
        const station = yield* yield* new RoutineDice(data, true);
        yield new EventPutSpiritRock(data.turnPlayer.location);
        yield 'end';
        yield new EventMessage('要石を置いた');
        yield 'end';
        return station;
    }
}

class EventPutSpiritRock implements GameEvent<void>{
    constructor(private readonly location: Station){
    }
    init(){
    }
    update(data: GameData){
        data.field.putSpiritRock(this.location);
        return { result: undefined };
    }
    final(){
    }
}