import { Exportable } from "../../utils/exportable";
import { StationEstate } from "../stations/stationEstate";

export class Estate implements Exportable{
    private station: StationEstate;
    name : string;

    constructor(){

    }

    final(){

    }
    
    setStation(station: StationEstate){
        this.station = station;
    }

    toJSON(): Object {
        //例で名前追加したけどまあよしなに
        return {
            "name" : this.name
        };
    }
}