import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { result } from "./event";

export function* eventTurn(){
    yield* [new EventMessage('ターン開始'), 'end'];
    const choice = yield* result(new EventChoose(['サイコロ', 'カード']));
    switch(choice){
        case 'サイコロ': yield* dice();
        case 'カード': yield* card();
    }
    yield 'end';
}

function* dice(){
    yield new EventMessage('サイコロを振れ！');
    const n = yield* result(new EventDice(1));
    yield new EventMessage(`${n} が出た`);
}
function* card(){
    yield new EventMessage('まだ実装してない');
}