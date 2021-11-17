import { EventDice } from "../events/eventDice";
import { GameData } from "../gameData/gameData";
import { Routine } from "./routine";
import { RoutineMove } from "./routineMove";

/**
 * サイコロを振るルーチン
 * @param canCancel 振るのをやめられるかどうか
 * @returns 振ったら RoutineMove、振らなかったら `null`
 */
export class RoutineDice extends Routine<RoutineMove | null>{
    constructor(data: GameData, private readonly canCancel: boolean){
        super(data);
    }
    *routine(data: GameData){
        const dice = yield* Routine.execute(new EventDice(1, this.canCancel));
        yield 'end';
        return dice && new RoutineMove(data, dice);
    }
}
