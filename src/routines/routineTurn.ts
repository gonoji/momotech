import { EventChoose } from "../events/eventChoose";
import { EventDice } from "../events/eventDice";
import { EventMessage } from "../events/eventMessage";
import { GameData } from "../gameData/gameData";
import { GameDate } from "../gameData/gameDate";
import { Routine, Routines } from "./routine";
import { RoutineCard } from "./routineCard";
import { RoutineMove } from "./routineMove";

export class RoutineTurnStart extends Routine<Routines>{
    *routine(data: GameData){
        yield* data.routineMonthStart(); // todo ここじゃない
        data.turnPlayer.focus();
        yield new EventMessage(dateToText(data.date) + ': ターン開始');
        yield 'end';
        return new RoutineTurn(data);
    }
}

const choicesTurn = ['サイコロ', 'カード'] as const;
class RoutineTurn extends Routine<Routines>{
    *routine(data: GameData){
        const eventChoose = new EventChoose.Forced(choicesTurn);
        while(true){
            const choice = yield* Routine.execute(eventChoose);
            console.log(choice);
            const action = RoutineTurn.action(data, choice);
            const next = yield* action;
            if(!next) continue;
            yield 'end'; // eventChoose
            return yield* next;
        }
    }
    private static action(data: GameData, choice: typeof choicesTurn[number]){
        switch(choice){
            case 'サイコロ': return new RoutineDice(data);
            case 'カード': return new RoutineCard(data);
        }
    }
}
class RoutineDice extends Routine<RoutineMove | null>{
    *routine(data: GameData){
        const dice = yield* Routine.execute(new EventDice.CanCancel(1));
        yield 'end';
        return dice == null? null: new RoutineMove(data, dice);
    }
}


export class RoutineTurnEnd extends Routine<Routines>{
    *routine(data: GameData){
        yield new EventMessage(dateToText(data.date) + ': ターン終了');
        yield 'end';
        data.date.advance(data.players.length);
        return new RoutineTurnStart(data);
    }
}

function dateToText(date: GameDate){
    return `${date.year} 年 ${date.month} 月 ${date.week + 1} 週`;
}
