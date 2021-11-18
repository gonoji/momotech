import { Exportable } from "../../utils/exportable";
import { StationEstate } from "../stations/stationEstate";
import { Util } from "../../utils/util";

export type estateData = {
     name: string, price: number, profit: number, isAgri: boolean
};

export class Estate implements Exportable{
    public name: string;
    public price: number;
    public profit: number;
    public isAgri: boolean;
    public readonly id: string;

    constructor(public data: estateData, public station: StationEstate){
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