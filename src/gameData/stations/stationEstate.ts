import { EventMessage } from "../../events/eventMessage";
import { Estate } from "../estates/estate";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";
import { estateData } from "../estates/estate";

export type stationEstateData = {
    estates: {
        [id: string]: estateData;
    }
  };
export class StationEstate extends Station{
    readonly estates: Estate[];
    estateData: stationEstateData;
    constructor(data: stationEstateData & stationData, x: number = 0, y: number = 0, z: number = 0, id: number = -1, estates : any = {}){
        super(data, x, y, z, 'estate', id);
        this.estates = [];
        this.estateData = {
            estates: {}
        }
        if(data != null){
            this.estateData = data;
            for(let v of Object.values(data.estates)){
                if(v != null)
                    this.estates.push(new Estate(v, this));
            }
        }
        
        for(const key in Object.keys(estates)){
            this.estates.push(new Estate(data.estates[key], this));
        }
        if(this.estates.length == 0){
            this.addEstate(new Estate({name: "new Estate", price: 100, profit: 10, isAgri: false}, this));
        }
    }
    *routine(){
        yield new EventMessage('物件駅に止まった');
        yield 'end';
        yield new EventMessage(`この駅の物件は\n${this.estates.map(estate => estate.name).join(' ')}\nです。`);
        yield 'end';
    }
    toJSON(){
        return {...this.data, ...this.estateData};
    }
    addEstate(estate: Estate){
        this.estateData.estates[estate.id] = estate.data;
        this.estates.push(estate);
    }
    changeEstate(estate: Estate){
        this.estateData.estates[estate.id] = estate.data;
    }
    removeEstate(index: number){
        this.estateData.estates[this.estates[index].id] = null;
        this.estates.splice(index, 1);
    }
}
