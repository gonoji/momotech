import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { EventMove } from "../events/eventMove";
import { EventView } from "../events/eventView";
import { RoutineStation } from "./routineStation";
import { Routine } from "./routine";
import { EventMessage } from "../events/eventMessage";
import { RoutineTurnEnd } from "./routineTurn";

export class RoutineMove extends Routine<RoutineStation | RoutineTurnEnd>{
    constructor(data: GameData, private readonly steps: number){
        super(data);
    }
    *routine(data: GameData){
        if(!this.canMove(data)){
            yield new EventMessage('移動できる駅がない！');
            yield 'end';
            return new RoutineTurnEnd(data);
        }
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
    private canMove(data: GameData){
        return data.field.accessibleStations(data.turnPlayer.location, this.steps).length > 0;
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
