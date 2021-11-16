import { Exportable } from "../../utils/exportable";
import { StationEstate } from "../stations/stationEstate";
import { Util } from "../../utils/util";

export type estateData = {
     name: string, price: number, profit: number, isAgri: boolean
};

export class Estate implements Exportable{
    public station: StationEstate;
    readonly name: string;
    readonly price: number;
    readonly profit: number;
    readonly isAgri: boolean;
    public readonly id: string;

    constructor(public data: estateData){
        this.name = data.name;
        this.price = data.price;
        this.profit = data.profit;
        this.isAgri = data.isAgri;
        this.id = Util.getRandomStringID(4);
    }

    final(){

    }


    toJSON(): Object {
        return {};
    }
}