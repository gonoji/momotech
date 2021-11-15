import { Exportable } from "../../utils/exportable";
import { FileIO } from "../../utils/fileIO";
import { StationEstate } from "../stations/stationEstate";

export type estateData = {
     name: string, price: number, profit: number, isAgri: boolean
};

export class Estate implements Exportable{
    public station: StationEstate;
    readonly name: string;
    readonly price: number;
    readonly profit: number;
    readonly isAgri: boolean;

    constructor(public data: estateData){
        this.name = data.name;
        this.price = data.price;
        this.profit = data.profit;
        this.isAgri = data.isAgri;
    }

    final(){

    }


    toJSON(): Object {
        return {};
    }
}