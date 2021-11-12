import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { routine, subroutine } from "./eventManager"
import { EventMove } from "./eventMove";
import { result } from "./event";
import { GameData } from "../gameData/gameData";
import { GameDate } from "../gameData/gameDate";

export function* routineTurn(gameData: GameData): routine{
    return routineTurnBody(gameData);
}

function* routineTurnBody(gameData: GameData): routine{
    yield new EventMessage(dateToText(gameData.date) + ': ターン開始');
    yield 'end';
    const choose = new EventChoose(['サイコロ', 'カード']);
    yield choose;
    while(true){
        const event = yield* action(choose.result());
        if(event){
            yield 'end';
            yield event;
            yield 'end';
            yield* gameData.turnPlayer.location.routine();
            return routineTurnEnd(gameData);
        }
        yield 'wait';
    }
}

function* routineTurnEnd(gameData: GameData): routine{
    yield new EventMessage(dateToText(gameData.date) + ': ターン終了');
    yield 'end';
    gameData.date.advance(gameData.players.length);
    return routineTurn(gameData);
}

function dateToText(date: GameDate){
    return `${date.year} 年 ${date.month} 月 ${date.week} 週`;
}

function* action(choice: string): subroutine<EventMove|void>{
    switch(choice){
        case 'サイコロ': return yield* dice();
        case 'カード': return yield* card();
    }
}

function* dice(): subroutine<EventMove>{
    yield new EventMessage('サイコロを振れ！');
        const n = yield* result(new EventDice(1));
        yield 'end';
    yield 'end';
    yield new EventMessage(`${n} が出た`);
    yield 'end';
    return new EventMove(n);
}
function* card(): subroutine<void>{
    yield new EventMessage('まだ実装してない');
    yield 'end';
}
