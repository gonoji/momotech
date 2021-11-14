import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { EventMove } from "./eventMove";
import { command } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { GameEvent } from "./event";
import { Card } from "../gameData/cards/card";

export type routine = Generator<command, routine, unknown>;
export type subroutine<T> = Generator<command, T, unknown>;

export class RoutineManager{
    private routine: routine;
    constructor(private readonly gameData: GameData){
        this.routine = this.init();
    }

    next(eventResult?: unknown): command{
        const next = this.routine.next(eventResult);
        if(next.done){
            if(next.value){
                this.routine = next.value;
                return this.next();
            }
        }
        return next.value as command;
    }

    private *init(){
        yield new EventMessage('ゲーム開始');
        yield 'end';
        return this.turn();
    }

    private *turn(): routine{
        yield new EventMessage(this.dateToText() + ': ターン開始');
        yield 'end';
        return this.turnBody();
    }
    
    private *turnBody(): routine{
        const choose = new EventChoose(['サイコロ', 'カード']);
        while(true){
            const choice = yield* RoutineManager.result(choose);
            const next = yield* this.action(choice);
            if(next){
                yield 'end';
                return next;
            }
        }
    }
    
    private *turnEnd(): routine{
        yield new EventMessage(this.dateToText() + ': ターン終了');
        yield 'end';
        this.gameData.date.advance(this.gameData.players.length);
        return this.turn();
    }
        
    private *action(choice: string): routine{
        switch(choice){
            case 'サイコロ': return yield* this.dice();
            case 'カード': return yield* this.card();
        }
    }
    
    private *dice(): routine{
        const sum = yield* RoutineManager.result(new EventDice(1));
        yield 'end';
        return this.move(sum);
    }
    private *move(steps: number): routine{
        const move = new EventMove(steps);
        while(true){
            const next = yield* RoutineManager.result(move);
            switch(next){
            case 'station':
                yield 'end';
                return this.station();
            case 'view':
                yield new EventMessage('まだ実装してない');
                yield 'end';
            }
        }
    }

    private *card(): routine{
        const ret = yield* Card.get('Dice3').routine();
        return this[ret]();
    }
    private *station(): routine{
        yield* this.gameData.turnPlayer.location.routine(this.gameData);
        return this.turnEnd();
    }

    private dateToText(){
        const date = this.gameData.date;
        return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
    }

    static *result<T>(event: GameEvent<T>): subroutine<T>{
        return (yield event) as T;
    }
}
