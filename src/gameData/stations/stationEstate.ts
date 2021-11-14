import { EventMessage } from "../../events/eventMessage";
import { subroutine } from "../../events/routineManager";
import { Estate } from "../estates/estate";
import { GameData } from "../gameData";
import { Station } from "./station";

type estatesData = {
    [id: string]: { name: string, price: number, description: string }
};
export class StationEstate extends Station{
    public estatesData : Estate[];
    constructor(x: number, y: number, z: number = 0, id: number = -1, estates : any){
        super(x, y, z, 'estate', id);
        this.estatesData = [];
        for(let i = 0; i < estates.length ; i++){
            this.estatesData.push(new Estate(estates[i]));
        }
    }
    *routine(gameData: GameData): subroutine<void> {
        yield new EventMessage('物件駅に止まった');
        yield 'end';
        let message : string = 'この駅の物件は\r\n';
        this.estatesData.forEach(e => {message += e.name + " "});
        message += '\r\nです。';
        yield new EventMessage(message);
        yield 'end';
    }

}