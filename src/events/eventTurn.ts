import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { result } from "./event";
import { routine } from "./eventManager"

export function* eventTurn(): routine{
    yield new EventMessage('ターン開始');
    yield 'end';
    const choice = yield* result(new EventChoose(['サイコロ', 'カード']));
    switch(choice){
        case 'サイコロ': yield* dice(); break;
        case 'カード': yield* card(); break;
    }
    return 'end';
}

function* dice(){
    yield new EventMessage('サイコロを振れ！');
    const n = yield* result(new EventDice(1));
    yield 'end';
    yield 'end';
    yield new EventMessage(`${n} が出た`);
    yield 'end';
}
function* card(){
    yield new EventMessage('まだ実装してない');
    yield 'end';
}
