import { EventMessage } from "../../events/eventMessage";
import { Station } from "./station";

export class StationMinus extends Station{
    constructor(x: number, y: number, z: number = 0){
        super(x, y, z, 'minus');
    }
    event(){
        return new EventMessage('マイナス駅に止まった');
    }
}