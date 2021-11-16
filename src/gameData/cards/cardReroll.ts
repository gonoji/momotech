import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { subroutine } from "../../routines/routineManager";
import { askYesNo, execute, RoutineMove } from "../../routines/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *routine(data: GameData){
        const dice = yield* this.roll();
        return yield* yield* new RoutineMove(data, dice);
    }
    private *roll(){
        const dice = yield* execute(new EventDice(1));
        yield* execute(new EventMessage(`${dice} が出ましたが振り直しますか？`));
        const yes = yield* askYesNo();
        yield 'end';
        yield 'end';
        return yes? yield* this.reroll(): dice;
    }
    private *reroll(){
        const dice = yield* execute(new EventDice(1));
        yield 'end';
        return dice;
    }
}

