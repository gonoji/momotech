import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { subroutine } from "../../events/routineManager";
import { askYesNo, execute, move } from "../../events/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *routine(data: GameData){
        const dice1 = yield* execute(new EventDice(1));
        yield* execute(new EventMessage(`${dice1} が出ましたが振り直しますか？`));
        const yes = yield* askYesNo();
        yield 'end';
        yield 'end';
        yield 'end';
        if(!yes) return move(data, dice1);
        else{
            const dice2 = yield* execute(new EventDice(1));
            yield 'end';
            return move(data, dice2);
        }
    }
}

