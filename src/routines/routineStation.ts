import { GameData } from "../gameData/gameData";
import { Routine } from "./routine";
import { routineArriveDest } from "./routineDest";
import { RoutineTurnEnd } from "./routineTurn";

export class RoutineStation extends Routine<RoutineTurnEnd>{
    *routine(data: GameData){
        if(data.turnPlayer.location == data.field.destination?.location){
            yield* routineArriveDest(data);
        }
        yield* data.turnPlayer.location.routine(data);
        return new RoutineTurnEnd(data);
    }
}
