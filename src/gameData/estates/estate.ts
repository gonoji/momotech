import { Exportable } from "../../utils/exportable";
import { FileIO } from "../../utils/fileIO";
import { StationEstate } from "../stations/stationEstate";

type estatesData = {
    [id: string]: { name: string, price: number, profit: number }
};

export class Estate implements Exportable{
    private static data: estatesData;
    public station: StationEstate;
    readonly name: string;
    readonly price: number;
    readonly profit: number;

    static create(){
        Estate.data = FileIO.getJson('estates');
    }

    constructor(id: string){
        this.name = Estate.data[id].name;
        this.price = Estate.data[id].price;
        this.profit = Estate.data[id].profit;
    }

    final(){

    }


    toJSON(): Object {
        return {};
    }
}