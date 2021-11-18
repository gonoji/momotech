import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { EventMove } from "../events/eventMove";
import { EventView } from "../events/eventView";
import { RoutineStation } from "./routineStation";
import { Routine } from "./routine";

export class RoutineMove extends Routine<RoutineStation>{
    constructor(data: GameData, private readonly steps: number){
        super(data);
    }
    *routine(data: GameData){
        const move = new EventMove(this.steps);
        while(true){
            const result = yield* Routine.execute(move);
            switch(result){
            case 'station':
                yield 'end'; // eventMove
                return new RoutineStation(data);
            case 'view':
                const next = yield* new RoutineView(data, move.stepsLeft, move.from);
                continue;
                // if(!next) continue;
                // yield 'end'; // eventMove
                // yield* next;
                // return new RoutineStation(data);
            default:
                const _: never = result;
            }
        }
    }
}

class RoutineView extends Routine<null>{
    constructor(data: GameData, private readonly steps: number, private readonly from: Direction.asType){
        super(data);
    }
    *routine(data: GameData){
        const result = yield* Routine.execute(new EventView(this.steps, this.from));
        switch(result){
        case 'resume':
            yield 'end';
            return null;
        }
        const _: never = result;
    }
}
