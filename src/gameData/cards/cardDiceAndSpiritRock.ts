import { GameData } from "../gameData";
import { Card } from "./card";
import { GameEvent } from "../../events/event";
import { Station } from "../stations/station";
import { EventMessage } from "../../events/eventMessage";
import { routineDice } from "../../routines/routineDice";
import { RoutineMove } from "../../routines/routineMove";

export class CardDiceAndSpiritRock extends Card{
    *routine(data: GameData){
        const steps = yield* routineDice(1, false);
        const station = yield* new RoutineMove(data, steps);
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