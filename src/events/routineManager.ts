import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { EventMove } from "./eventMove";
import { command } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { GameEvent } from "./event";

export type routine = Generator<command, routine, unknown>;
export type subroutine<T> = Generator<command, T, unknown>;

export class RoutineManager{
    private routine: routine;
    constructor(private readonly gameData: GameData){
        this.routine = this.init();
    }

    next(): command{
        const next = this.routine.next();
        if(next.done){
            if(next.value){
                this.routine = next.value;
                return this.next();
            }
        }
        return next.value as command;
    }

    *init(){
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return this.turn();
    }

    *turn(): routine{
        yield new EventMessage(this.dateToText() + ': ターン開始');
        yield 'end';
        return this.turnBody();
    }
    
    *turnBody(): routine{
        const choose = new EventChoose(['サイコロ', 'カード']);
        yield choose;
        while(true){
            const next = yield* this.action(choose.result());
            if(next){
                yield 'end';
                return next;
            }
            yield 'wait';
        }
    }
    
    *turnEnd(): routine{
        yield new EventMessage(this.dateToText() + ': ターン終了');
        yield 'end';
        this.gameData.date.advance(this.gameData.players.length);
        return this.turn();
    }
    
    dateToText(){
        const date = this.gameData.date;
        return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
    }
    
    *action(choice: string): routine{
        switch(choice){
            case 'サイコロ': return yield* this.dice();
            case 'カード': return yield* this.card();
        }
    }
    
    *dice(){
        const sum = yield* RoutineManager.result(new EventDice(1));
        yield 'end';
        return this.move(sum);
    }
    *card(){
        yield new EventMessage('まだ実装してない');
        yield 'end';
        return null;
    }

    *move(steps: number): routine{
        yield new EventMove(steps);
        yield 'end';
        yield* this.gameData.turnPlayer.location.routine(this.gameData);
        return this.turnEnd();
    }

    static *result<T>(event: GameEvent<T>){
        yield event;
        return event.result();
    }
}
