import { GameData } from "../gameData/gameData";
import { Routine } from "./routine";
import { RoutineTurnEnd } from "./routineTurn";

export class RoutineStation extends Routine<RoutineTurnEnd>{
    *routine(data: GameData){
        yield* data.turnPlayer.location.routine(data);
        return new RoutineTurnEnd(data);
    }
}
