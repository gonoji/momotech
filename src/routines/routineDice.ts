import { EventDice } from "../events/eventDice";
import { subroutine } from "./routine";
import { Routine } from "./routine";

/**
 * サイコロを振るサブルーチン
 * @param num サイコロの個数
 * @param canCancel 振るのをやめられるかどうか
 * @returns 振ったら出目の和、振らなかったら `null`
 */
export function routineDice(num: number, canCancel: true): subroutine<number | null>;
export function routineDice(num: number, canCancel: false): subroutine<number>;
export function* routineDice(num: number, canCancel: boolean): subroutine<number | null>{
    const event = canCancel? new EventDice.CanCancel(num): new EventDice.Forced(num);
    const dice = yield* Routine.execute(event);
    yield 'end';
    return dice == null? null: dice;
}
