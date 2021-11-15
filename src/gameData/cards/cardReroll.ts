import { EventChoose } from "../../events/eventChoose";
import { EventDice } from "../../events/eventDice";
import { EventMessage } from "../../events/eventMessage";
import { execute, move } from "../../events/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

export class CardReroll extends Card{
    *routine(data: GameData){
        const dice1 = yield* execute(new EventDice(1));
        yield* execute(new EventMessage(`${dice1}が出ましたが振り直しますか?`));
        const choiceYN = yield* execute(new EventChoose(['はい', 'いいえ']));
        yield 'end';
        yield 'end';
        yield 'end';
        if(choiceYN == 'いいえ'){            
            return move(data, dice1);
        }
        else{
            const dice2 = yield* execute(new EventDice(1));
            yield 'end';
            return move(data, dice2);
        }        
    }
}

