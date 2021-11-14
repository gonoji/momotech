import { subroutine } from "../../events/routineManager";
import { Estate } from "../estates/estate";
import { GameData } from "../gameData";
import { Station } from "./station";

export class StationEstate extends Station{

    estates: Estate[];
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'estate', id);
        this.estates = [];
    }
    routine(gameData: GameData): subroutine<void> {
        throw new Error("Method not implemented.");
    }

}