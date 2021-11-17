import { EventChoose } from "../events/eventChoose";
import { EventMessage } from "../events/eventMessage";
import { GameData } from "../gameData/gameData";
import { GameDate } from "../gameData/gameDate";
import { Routine, Routines } from "./routine";
import { RoutineCard } from "./routineCard";
import { RoutineDice } from "./routineDice";

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
        const eventChoose = new EventChoose(choicesTurn);
        while(true){
            const choice = yield* Routine.execute(eventChoose);
            const action = RoutineTurn.action(data, choice);
            const next = yield* action;
            if(!next) continue;
            yield 'end'; // eventChoose
            return yield* next;
        }
    }
    private static action(data: GameData, choice: typeof choicesTurn[number]){
        switch(choice){
            case 'サイコロ': return new RoutineDice(data, true);
            case 'カード': return new RoutineCard(data);
        }
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
