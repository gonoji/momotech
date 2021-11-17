import { EventMessage } from "../events/eventMessage";
import { EventUseCard } from "../events/eventUseCard";
import { Card } from "../gameData/cards/card";
import { GameData } from "../gameData/gameData";
import { Routine, Routines } from "./routine";

export class RoutineCard extends Routine<RoutineUseCard | null>{
    *routine(data: GameData){
        if(data.turnPlayer.cards.length == 0){
            yield new EventMessage('カードを 1 枚も持っていない！');
            yield 'end';
            return null;
        }
        const eventUseCard = new EventUseCard(data.turnPlayer);
        while(true){
            const card = yield* Routine.execute(eventUseCard);
            if(!card){
                yield 'end'; // useCard
                return null;
            }
            yield new EventMessage('このカードを使いますか？');
            const yes = yield* Routine.askYesNo();
            yield 'end';
            if(!yes) continue;

            yield 'end'; // useCard
            return new RoutineUseCard(data, card);
        }
    }
}
class RoutineUseCard extends Routine<Routines>{
    constructor(data: GameData, private readonly card: Card){
        super(data);
    }
    *routine(data: GameData){
        data.turnPlayer.cards.splice(data.turnPlayer.cards.indexOf(this.card), 1);
        yield new EventMessage(`${this.card.name} を使った`);
        yield 'end';
        return yield* this.card.routine(data);
    }
}
