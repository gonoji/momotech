import { EventChoose } from "../../events/eventChoose";
import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { Routine } from "../../events/routineManager";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *routine(data: GameData){
        const dice1 = yield* Routine.result(new EventDice(1));
        yield* Routine.result(new EventMessage(`${dice1}が出ましたが振り直しますか?`));
        const choiceYN = yield* Routine.result(new EventChoose(['はい', 'いいえ']));
        yield 'end';
        yield 'end';
        yield 'end';
        if(choiceYN == 'いいえ'){            
            return Routine.move(data, dice1);
        }
        else{
            const dice2 = yield* Routine.result(new EventDice(1));
            yield 'end';
            return Routine.move(data, dice2);
        }        
    }
}

