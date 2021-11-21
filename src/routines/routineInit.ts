import { EventMessage } from "../events/eventMessage";
import { Card, cardID } from "../gameData/cards/card";
import { GameData } from "../gameData/gameData";
import { Routine, Routines } from "./routine";
import { RoutinePickDest } from "./routineDest";
import { RoutineTurnStart } from "./routineTurn";

export class RoutineInit extends Routine<Routines>{
    *routine(data: GameData){
        this.debug(data);
        yield* new RoutinePickDest(data);
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return new RoutineTurnStart(data);
    }

    private debug(data: GameData){
        const cardIDs: cardID[] = [
            'DiceAndSpiritRock',
            'Advance30',
            'Reroll',
        ];
        data.turnPlayer.cards.push(...cardIDs.map(id => Card.get(id)));
    }
}

