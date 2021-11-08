import { EventMessage } from "../../events/eventMessage";
import { Station } from "./station";

export class StationPlus extends Station{
    constructor(x: number, y: number, z: number = 0){
        super(x, y, z, 'plus');
    }
    event(){
        return new EventMessage('プラス駅に止まった');
    }
}