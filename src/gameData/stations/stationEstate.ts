import { EventMessage } from "../../events/eventMessage";
import { Estate } from "../estates/estate";
import { Station, stationData } from "./station";
import { estateData } from "../estates/estate";

type estates = Record<string, estateData>;
export type stationEstateData = { estates: estates };

export class StationEstate extends Station{
    readonly estates: Estate[];
    estateData: stationEstateData;
    constructor(data: stationEstateData & stationData | null, x: number = 0, y: number = 0, z: number = 0, id: number | null = null, estates: estates = {}){
        super(data, x, y, z, 'estate', id);
        this.estates = [];
        this.estateData = { estates: {} };
        if(data != null){
            this.estateData = data;
            for(const v of Object.values(data.estates)){
                this.estates.push(new Estate(v, this));
            }
        }
        Object.values(estates).forEach(estate => {
            this.estates.push(new Estate(estate, this));
        });

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
        delete this.estateData.estates[this.estates[index].id];
        this.estates.splice(index, 1);
    }
}
