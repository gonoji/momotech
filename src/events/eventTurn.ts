import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";

export function eventTurn(){
    return new EventMessage('ターン開始',
        new EventDice(1, n => new EventMessage(`${n} が出た`))
    );
}
