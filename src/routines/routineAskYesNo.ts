import { EventChoose } from "../events/eventChoose";
import { Routine } from "./routine";

/**「はい」「いいえ」の 2 択を選ぶサブルーチン
 * @returns「はい」を選んだかどうか
 */
export function *routineAskYesNo(){
    const choice = yield* Routine.execute(new EventChoose.CanCancel(['はい'], 'いいえ'));
    yield 'end';
    return choice == 'はい';
}
