import { Card } from "../gameData/cards/card";
import { GameData } from "../gameData/gameData";
import { GameDate } from "../gameData/gameDate";
import { Direction } from "../utils/direction";
import { GameEvent } from "./event";
import { EventChoose } from "./eventChoose";
import { EventDice } from "./eventDice";
import { EventMessage } from "./eventMessage";
import { EventMove } from "./eventMove";
import { EventUseCard } from "./eventUseCard";
import { EventView } from "./eventView";
import { routine, subroutine } from "./routineManager";

export function* init(data: GameData): routine{
    yield new EventMessage('ゲーム開始');
    yield 'end';
    return turnStart(data);
}

function* turnStart(data: GameData): routine{
    yield* data.routineTurnStart();
    yield new EventMessage(dateToText(data.date) + ': ターン開始');
    yield 'end';
    return turnBody(data);
}

const choicesTurn = ['サイコロ', 'カード'] as const;

function* turnBody(data: GameData): routine{
    const eventChoose = new EventChoose(choicesTurn);
    while(true){
        const choice = yield* execute(eventChoose);
        const next = yield* action(data, choice);
        if(next){
            yield 'end'; // eventChoose
            return next;
        }
    }
}

function* turnEnd(data: GameData): routine{
    yield new EventMessage(dateToText(data.date) + ': ターン終了');
    yield 'end';
    data.date.advance(data.players.length);
    return turnStart(data);
}

function* action(data: GameData, choice: typeof choicesTurn[number]): subroutine<routine>{
    switch(choice){
        case 'サイコロ': return yield* dice(data);
        case 'カード': return yield* card(data);
    }
}

function* dice(data: GameData): subroutine<routine>{
    const sum = yield* execute(new EventDice(1));
    yield 'end';
    return move(data, sum);
}
export function* move(data: GameData, steps: number): routine{
    const eventMove = new EventMove(steps);
    while(true){
        const result = yield* execute(eventMove);
        switch(result){
        case 'station':
            yield 'end'; // eventMove
            return station(data);
        case 'view':
            const next = yield* view(data, eventMove.stepsLeft, eventMove.from);
            if(next){
                yield 'end'; // eventMove
                return next;
            }
            continue;
        default:
            const _: never = result;
        }
    }
}
function* view(data: GameData, steps: number, from: Direction.asType): subroutine<routine>{
    const result = yield* execute(new EventView(steps, from));
    switch(result){
    case 'resume':
        yield 'end';
        return null;
    default:
        const _: never = result;
    }
}

function* card(data: GameData): subroutine<routine>{
    if(data.turnPlayer.cards.length == 0){
        yield new EventMessage('カードを 1 枚も持っていない！');
        yield 'end';
        return null;
    }
    const eventUseCard = new EventUseCard(data.turnPlayer);
    while(true){
        const card = yield* execute(eventUseCard);
        if(!card){
            yield 'end';
            return null;
        }
        yield new EventMessage('このカードを使いますか？');
        const yes = yield* askYesNo();
        yield 'end';
        if(!yes) continue;

        yield 'end'; // eventUseCard
        return useCard(data, card);
    }
}
function* useCard(data: GameData, card: Card): routine{
    data.turnPlayer.cards.splice(data.turnPlayer.cards.indexOf(card));
    yield new EventMessage(`${card.name} を使った`);
    yield 'end';
    return yield* card.routine(data);
}

function* station(data: GameData): routine{
    yield* data.turnPlayer.location.routine(data);
    return turnEnd(data);
}

function dateToText(date: GameDate){
    return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
}

export function* askYesNo(): subroutine<boolean>{
    const choice = yield* execute(new EventChoose(['はい', 'いいえ'] as const));
    return choice == 'はい';
}

export function* execute<T>(event: GameEvent<T>): subroutine<T>{
    return (yield event) as T;
}
