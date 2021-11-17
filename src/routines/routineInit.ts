import { EventMessage } from "../events/eventMessage";
import { GameData } from "../gameData/gameData";
import { Routine, Routines } from "./routine";
import { RoutineTurnStart } from "./routineTurn";

export class RoutineInit extends Routine<Routines>{
    *routine(data: GameData){
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return new RoutineTurnStart(data);
    }
}

