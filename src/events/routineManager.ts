import { EventMessage } from "./eventMessage";
import { EventDice } from "./eventDice";
import { EventChoose } from "./eventChoose";
import { EventMove } from "./eventMove";
import { command } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { GameEvent } from "./event";
import { Card } from "../gameData/cards/card";
import { Util } from "../utils/util";

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
        yield new EventMove(steps);
        yield 'end';
        return this.station();
    }
    private *card(): routine{
        const id = 'Dice3';
        return this.useCard(id);
    }
    private *useCard(id: string): routine{
        const ret = yield* Card.get(id).routine();
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
        yield event;
        return event.result();
    }
}
