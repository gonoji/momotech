import { EventMessage } from "../../events/eventMessage";
import { Estate } from "../estates/estate";
import { roadData, Station, stationBaseData } from "./station";
import { estateData } from "../estates/estate";
import { Util } from "../../utils/util";

type estatesData = { [id: string]: estateData };
export type stationEstateData = { name: string, estates: estatesData } & stationBaseData;

export class StationEstate extends Station{
    name: string;
    readonly estates: Estate[];
    constructor(data: stationEstateData){
        super(data);
        this.name = data.name;
        this.estates = Object.values(data.estates).map(estateData => new Estate(estateData, this));
    }
    *routine(){
        yield new EventMessage('物件駅に止まった');
        yield 'end';
        yield new EventMessage(`この駅の物件は\n${this.estates.map(estate => estate.name).join(' ')}\nです。`);
        yield 'end';
    }
    toJSON(): stationEstateData & roadData{
        const json = super.toJSON();
        const estatesData = Util.fromEntries(this.estates.map((estate, i) => [i.toString(), estate.toJSON()] as const));
        return {
            ...json,
            name: this.name,
            estates: estatesData
        };
    }

    addEstate(estate: Estate){
        this.estates.push(estate);
    }
    changeEstate(index: number, estate: Estate){
        this.estates[index] = estate;
    }
    removeEstate(index: number){
        this.estates.splice(index, 1);
    }
}
