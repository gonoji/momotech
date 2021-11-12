import { EventMessage } from "../../events/eventMessage";
import { Station } from "./station";

export class StationPlus extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'plus', id);
    }
    *routine(){
        yield new EventMessage('プラス駅に止まった');
        yield 'end';
    }
}