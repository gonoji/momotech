import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { subroutine } from "../../routines/routineManager";
import { Routine } from "../../routines/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *subroutine(data: GameData){
        const dice = yield* this.roll();
        return yield* yield* Routine.move(data, dice);
    }
    private *roll(): subroutine<number>{
        const dice = yield* Routine.execute(new EventDice(1));
        yield* Routine.execute(new EventMessage(`${dice} が出ましたが振り直しますか？`));
        const yes = yield* Routine.askYesNo();
        yield 'end';
        yield 'end';
        return yes? yield* this.reroll(): dice;
    }
    private *reroll(): subroutine<number>{
        const dice = yield* Routine.execute(new EventDice(1));
        yield 'end';
        return dice;
    }
}

