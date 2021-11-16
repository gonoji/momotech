import { EventMessage } from "../../events/eventMessage";
import { Estate } from "../estates/estate";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";
import { estateData } from "../estates/estate";

export type stationEstateData = {
    estates: {
        [id: number]: estateData;
    }
  };
export class StationEstate extends Station{
    public estates: Estate[];
    public estateData: stationEstateData;
    constructor(data: stationEstateData & stationData, x: number = 0, y: number = 0, z: number = 0, id: number = -1, estates : any = {}){
        super(data, x, y, z, 'estate', id);
        this.estates = [];
        this.estateData = {
            estates: {}
        }
        if(data != null){
            this.estateData = data;
            for(let key in Object.keys(data.estates)){
                this.estates.push(new Estate(data.estates[key]));
            }
        }
        
        for(let key in Object.keys(estates)){
            this.estates.push(new Estate(data.estates[key]));
        }
    }
    *subroutine(gameData: GameData){
        yield new EventMessage('物件駅に止まった');
        yield 'end';
        yield new EventMessage(`この駅の物件は\n${this.estates.join(' ')}\nです。`);
        yield 'end';
    }
    toJSON(){
        return {...this.data, ...this.estateData};
    }
}
