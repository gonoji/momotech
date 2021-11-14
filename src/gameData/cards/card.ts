import { subroutine } from "../../events/routineManager";
import { FileIO } from "../../utils/fileIO";
import { cards } from "./cards";

type cardsData = {
    [id: string]: { name: string, price: number, description: string }
};

export abstract class Card{
    public static data: cardsData;
    static create(){
        Card.data = FileIO.getJson('cards');
    }
    static get(id: string){
        return new cards[id](id);
    }

    private _name: string;
    constructor(private readonly id: string){
        this._name = Card.data[this.id].name;
    }
    
    get name(){
        return this._name;
    }
    get price(){
        return Card.data[this.id].price;
    }
    get description(){
        return Card.data[this.id].description;
    }

    abstract routine(): subroutine<'turnBody'|'station'|'turnEnd'>;

}
