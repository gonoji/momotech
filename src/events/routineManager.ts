import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { EventMove } from "./eventMove";
import { command } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { GameEvent } from "./event";
import { Card } from "../gameData/cards/card";
import { EventView } from "./eventView";
import { GameDate } from "../gameData/gameDate";

export type routine = Generator<command, routine, unknown>;
export type subroutine<T> = Generator<command, T, unknown>;

export class RoutineManager{
    private routine: routine;
    constructor(data: GameData){
        this.routine = Routine.init(data);
    }

    next(data: GameData, eventResult?: unknown): command{
        const next = this.routine.next(eventResult);
        if(next.done){
            if(next.value){
                this.routine = next.value;
                return this.next(data);
            }
        }
        return next.value as command;
    }
}

export class Routine{
    private constructor(){
    }
    
    static *init(data: GameData){
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return this.turnStart(data);
    }

    private static *turnStart(data: GameData): routine{
        data.turnPlayer.focus();
        yield new EventMessage(this.dateToText(data.date) + ': ターン開始');
        yield 'end';
        return this.turnBody(data);
    }
    
    private static *turnBody(data: GameData): routine{
        const choose = new EventChoose(['サイコロ', 'カード']);
        while(true){
            const choice = yield* Routine.result(choose);
            const next = yield* this.action(data, choice);
            if(next){
                yield 'end'; // choose
                return next;
            }
        }
    }
    
    private static *turnEnd(data: GameData): routine{
        yield new EventMessage(this.dateToText(data.date) + ': ターン終了');
        yield 'end';
        data.date.advance(data.players.length);
        return this.turnStart(data);
    }
        
    private static *action(data: GameData, choice: string): routine{
        switch(choice){
            case 'サイコロ': return yield* this.dice(data);
            case 'カード': return yield* this.card(data);
        }
    }
    
    private static *dice(data: GameData): routine{
        const sum = yield* Routine.result(new EventDice(1));
        yield 'end';
        return this.move(data, sum);
    }
    static *move(data: GameData, steps: number): routine{
        const move = new EventMove(steps);
        while(true){
            const result = yield* Routine.result(move);
            switch(result){
            case 'station':
                yield 'end'; // move
                return this.station(data);
            case 'view':
                const next = yield* this.view(data, move.stepsLeft);
                if(next){
                    yield 'end'; // move
                    return next;
                }
                continue;
            default:
                const _: never = result;
            }
        }
    }
    private static *view(data: GameData, steps: number): routine{
        const result = yield* Routine.result(new EventView(steps));
        switch(result){
        case 'resume':
            yield 'end'; // view
            return null;
        default:
            const _: never = result;
        }
    }

    private static *card(data: GameData): routine{
        return yield* Card.get('Dice3').routine(data);
    }

    private static *station(data: GameData): routine{
        yield* data.turnPlayer.location.routine(data);
        return this.turnEnd(data);
    }

    private static dateToText(date: GameDate){
        return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
    }

    static *result<T>(event: GameEvent<T>): subroutine<T>{
        return (yield event) as T;
    }
}
