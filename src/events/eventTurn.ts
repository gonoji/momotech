import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { routine } from "./eventManager"
import { EventMove } from "./eventMove";
import { result } from "./event";

export function* eventTurn(): routine{
    yield new EventMessage('ターン開始');
    yield 'end';
    const choose = new EventChoose(['サイコロ', 'カード']);
    yield choose;
    while(true){
        const event = yield* action(choose.result());
        if(event){
            yield 'end';
            yield event;
            yield 'end';
            return eventTurn();
        }
        yield 'wait';
    }
}

function* action(choice: string){
    switch(choice){
        case 'サイコロ': return yield* dice();
        case 'カード': return yield* card();
    }
}

function* dice(){
    yield new EventMessage('サイコロを振れ！');
        const n = yield* result(new EventDice(1));
        yield 'end';
    yield 'end';
    yield new EventMessage(`${n} が出た`);
    yield 'end';
    return new EventMove(n);
}
function* card(){
    yield new EventMessage('まだ実装してない');
    yield 'end';
}
