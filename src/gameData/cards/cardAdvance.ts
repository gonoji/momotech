import { Routine } from "../../routines/routines";
import { GameData } from "../gameData";
import { Card } from "./card";

class CardAdvance extends Card{
    constructor(id: string, private readonly numAdvances: number){
        super(id);
    }
    *subroutine(data: GameData){
        return yield* yield* Routine.move(data, this.numAdvances);
    }
}

export class CardAdvance1 extends CardAdvance{
    constructor(id: string){
        super(id, 1);
    }
}
export class CardAdvance2 extends CardAdvance{
    constructor(id: string){
        super(id, 2);
    }
}
export class CardAdvance3 extends CardAdvance{
    constructor(id: string){
        super(id, 3);
    }
}
export class CardAdvance4 extends CardAdvance{
    constructor(id: string){
        super(id, 4);
    }
}
export class CardAdvance5 extends CardAdvance{
    constructor(id: string){
        super(id, 5);
    }
}
export class CardAdvance6 extends CardAdvance{
    constructor(id: string){
        super(id, 6);
    }
}
export class CardAdvance7 extends CardAdvance{
    constructor(id: string){
        super(id, 7);
    }
}
export class CardAdvance30 extends CardAdvance{
    constructor(id: string){
        super(id, 30);
    }
}
