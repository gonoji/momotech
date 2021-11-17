import { EventDice } from "../events/eventDice";
import { GameData } from "../gameData/gameData";
import { Routine } from "./routine";
import { RoutineMove } from "./routineMove";

export class RoutineDice extends Routine<RoutineMove | null>{
    constructor(data: GameData, private readonly forced: boolean){ // todo
        super(data);
    }
    *routine(data: GameData){
        const dice = yield* Routine.execute(new EventDice(1));
        yield 'end';
        return new RoutineMove(data, dice);
    }
}
