import { Card } from "../gameData/cards/card";
import { GameData } from "../gameData/gameData";
import { GameDate } from "../gameData/gameDate";
import { Direction } from "../utils/direction";
import { GameEvent } from "../events/event";
import { EventChoose } from "../events/eventChoose";
import { EventDice } from "../events/eventDice";
import { EventMessage } from "../events/eventMessage";
import { EventMove } from "../events/eventMove";
import { EventUseCard } from "../events/eventUseCard";
import { EventView } from "../events/eventView";
import { Routine, Routines } from "./routineManager";

export class RoutineInit extends Routine<Routines>{
    *routine(data: GameData){
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return new RoutineTurnStart(data);
    }
}
class RoutineTurnStart extends Routine<Routines>{
    *routine(data: GameData){
        yield* data.routineTurnStart();
        data.turnPlayer.focus();
        yield new EventMessage(dateToText(data.date) + ': ターン開始');
        yield 'end';
        return new RoutineTurn(data);
    }
}
const choicesTurn = ['サイコロ', 'カード'] as const;
class RoutineTurn extends Routine<Routines>{
    *routine(data: GameData){
        const eventChoose = new EventChoose(choicesTurn);
        while(true){
            const choice = yield* execute(eventChoose);
            const action = RoutineTurn.action(data, choice);
            const next = yield* action;
            if(!next) continue;
            yield 'end'; // eventChoose
            return yield* next;
        }
    }
    private static action(data: GameData, choice: typeof choicesTurn[number]){
        switch(choice){
            case 'サイコロ': return new RoutineDice(data, false);
            case 'カード': return new RoutineCard(data);
        }
    }
}
class RoutineTurnEnd extends Routine<Routines>{
    *routine(data: GameData){
        yield new EventMessage(dateToText(data.date) + ': ターン終了');
        yield 'end';
        data.date.advance(data.players.length);
        return new RoutineTurnStart(data);
    }
}

export class RoutineDice extends Routine<RoutineMove | null>{
    constructor(data: GameData, private readonly forced: boolean){ // todo
        super(data);
    }
    *routine(data: GameData){
        const dice = yield* execute(new EventDice(1));
        yield 'end';
        return new RoutineMove(data, dice);
    }
}

export class RoutineMove extends Routine<RoutineStation>{
    constructor(data: GameData, private readonly steps: number){
        super(data);
    }
    *routine(data: GameData){
        const move = new EventMove(this.steps);
        while(true){
            const result = yield* execute(move);
            switch(result){
            case 'station':
                yield 'end'; // eventMove
                return new RoutineStation(data);
            case 'view':
                const next = yield* new RoutineView(data, move.stepsLeft, move.from);
                continue;
                // if(!next) continue;
                // yield 'end'; // eventMove
                // yield* next;
                // return new RoutineStation(data);
            default:
                const _: never = result;
            }
        }
    }
}

class RoutineView extends Routine<null>{
    constructor(data: GameData, private readonly steps: number, private readonly from: Direction.asType){
        super(data);
    }
    *routine(data: GameData){
        const result = yield* execute(new EventView(this.steps, this.from));
        switch(result){
        case 'resume':
            yield 'end';
            return null;
        default:
            const _: never = result;
        }
    }
}

class RoutineCard extends Routine<RoutineUseCard | null>{
    *routine(data: GameData){
        if(data.turnPlayer.cards.length == 0){
            yield new EventMessage('カードを 1 枚も持っていない！');
            yield 'end';
            return null;
        }
        const eventUseCard = new EventUseCard(data.turnPlayer);
        while(true){
            const card = yield* execute(eventUseCard);
            if(!card){
                yield 'end'; // useCard
                return null;
            }
            yield new EventMessage('このカードを使いますか？');
            const yes = yield* askYesNo();
            yield 'end';
            if(!yes) continue;

            yield 'end'; // useCard
            return new RoutineUseCard(data, card);
        }
    }
}
class RoutineUseCard extends Routine<Routines>{
    constructor(data: GameData, private readonly card: Card){
        super(data);
    }
    *routine(data: GameData){
        data.turnPlayer.cards.splice(data.turnPlayer.cards.indexOf(this.card), 1);
        yield new EventMessage(`${this.card.name} を使った`);
        yield 'end';
        return yield* this.card.routine(data);
    }
}

export class RoutineStation extends Routine<RoutineTurnEnd>{
    *routine(data: GameData){
        yield* data.turnPlayer.location.routine(data);
        return new RoutineTurnEnd(data);
    }
}

export function* execute<T>(event: GameEvent<T>){
    return (yield event) as T;
}
export function* askYesNo(){
    const choice = yield* execute(new EventChoose(['はい', 'いいえ'] as const));
    yield 'end';
    return choice == 'はい';
}

function dateToText(date: GameDate){
    return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
}
