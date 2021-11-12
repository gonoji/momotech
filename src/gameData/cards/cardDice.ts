import { EventDice } from "../../events/eventDice";
import { EventMove } from "../../events/eventMove";
import { RoutineManager } from "../../events/routineManager";
import { Card } from "./card";

class CardDice extends Card{
    constructor(id: string, private readonly numDices: number){
        super(id);
    }
    *routine(){
        const sum = yield* RoutineManager.result(new EventDice(this.numDices));
        yield 'end';
        yield new EventMove(sum);
        yield 'end';
        return 'station' as const;
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
