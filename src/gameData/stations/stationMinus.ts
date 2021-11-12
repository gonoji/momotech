import { EventMessage } from "../../events/eventMessage";
import { Station } from "./station";

export class StationMinus extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'minus', id);
    }
    *routine(){
        yield new EventMessage('マイナス駅に止まった');
        yield 'end';
    }
}