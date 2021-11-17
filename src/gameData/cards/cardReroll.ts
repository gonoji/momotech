import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { Routine } from "../../routines/routine";
import { RoutineMove } from "../../routines/routineMove";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *routine(data: GameData){
        const dice = yield* this.roll();
        return yield* yield* new RoutineMove(data, dice);
    }
    private *roll(){
        const dice = yield* Routine.execute(new EventDice(1, false));
        yield* Routine.execute(new EventMessage(`${dice} が出ましたが振り直しますか？`));
        const yes = yield* Routine.askYesNo();
        yield 'end';
        yield 'end';
        return yes? yield* this.reroll(): dice;
    }
    private *reroll(){
        const dice = yield* Routine.execute(new EventDice(1, false));
        yield 'end';
        return dice;
    }
}

