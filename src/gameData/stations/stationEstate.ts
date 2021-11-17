import { EventMessage } from "../../events/eventMessage";
import { subroutine } from "../../events/routineManager";
import { Estate } from "../estates/estate";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";
import { estateData} from "../estates/estate";

export type stationEstateData = {
    estates: {
        [id: string]: estateData;
    }
  };
export class StationEstate extends Station{
    private _estates: Estate[];
    public estateData: stationEstateData;
    constructor(data: stationEstateData & stationData, x: number = 0, y: number = 0, z: number = 0, id: number = -1, estates : any = {}){
        super(data, x, y, z, 'estate', id);
        this._estates = [];
        this.estateData = {
            estates: {}
        }
        if(data != null){
            this.estateData = data;
            for(let v of Object.values(data.estates)){
                this._estates.push(new Estate(v, this));
            }
        }
        
        for(let key in Object.keys(estates)){
            this._estates.push(new Estate(data.estates[key], this));
        }this.addEstate(new Estate({name: "po", price: 100, profit: 10, isAgri: true}, this));
        this.addEstate(new Estate({name: "pi", price: 100, profit: 10, isAgri: true}, this));
    }
    *routine(gameData: GameData): subroutine<void> {
        yield new EventMessage('物件駅に止まった');
        yield 'end';
        let message : string = 'この駅の物件は\r\n';
        this._estates.forEach(e => {message += e.name + " "});
        message += '\r\nです。';
        yield new EventMessage(message);
        yield 'end';
    }
    toJSON(){
        return {...this.data, ...this.estateData};
    }
    addEstate(estate: Estate){
        this.estateData.estates[estate.id] = estate.data;
        this._estates.push(estate);
    }
    changeEstate(estate: Estate){
        this.estateData.estates[estate.id] = estate.data;
    }
    get estates(): Estate[]{
        return this._estates;
    }

}