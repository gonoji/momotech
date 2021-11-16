import { EventDice } from "../../events/eventDice";
import { Routine } from "../../events/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

class CardDice extends Card{
    constructor(id: string, private readonly numDices: number){
        super(id);
    }
    *subroutine(data: GameData){
        const sum = yield* Routine.execute(new EventDice(this.numDices));
        yield 'end';
        return yield* yield* Routine.move(data, sum);
    }
}

export class CardDice2 extends CardDice{
    constructor(id: string){
        super(id, 2);
    }
}
export class CardDice3 extends CardDice{
    constructor(id: string){
        super(id, 3);
    }
}
export class CardDice4 extends CardDice{
    constructor(id: string){
        super(id, 4);
    }
}
export class CardDice5 extends CardDice{
    constructor(id: string){
        super(id, 5);
    }
}
