import { Routine } from "../../events/routines";
import { GameData } from "../gameData";
import { Card } from "./card";
import { GameEvent } from "../../events/event";
import { Station } from "../stations/station";
import { routine, subroutine } from "../../events/routineManager";
import { EventMessage } from "../../events/eventMessage";

export class CardDiceAndSpiritRock extends Card{
    *subroutine(data: GameData): subroutine<routine>{
        const station = yield* yield* Routine.dice(data, true);
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