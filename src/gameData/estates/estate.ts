import { Exportable } from "../../utils/exportable";
import { StationEstate } from "../stations/stationEstate";
import { Util } from "../../utils/util";

export type estateData = {
     name: string, price: number, profit: number, isAgri: boolean
};

export class Estate implements Exportable{
    readonly id: string;
    name: string;
    price: number;
    profit: number;
    isAgri: boolean;

    constructor(data: estateData, public location: StationEstate){
        this.id = Util.getRandomStringID(4);
        this.name = data.name;
        this.price = data.price;
        this.profit = data.profit;
        this.isAgri = data.isAgri;
    }
    final(){
    }
    toJSON(): estateData{
        return {
            name: this.name,
            price: this.price,
            profit: this.profit,
            isAgri: this.isAgri
        };
    }
}