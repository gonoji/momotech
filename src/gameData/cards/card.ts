import { Routines, subroutine } from "../../routines/routine";
import { FileIO } from "../../utils/fileIO";
import { GameData } from "../gameData";
import { cards } from "./cards";

type cardsData = {
    [id in cardID]: { name: string, price: number, description: string }
};
export type cardID = keyof typeof cards;

export abstract class Card{
    static data: cardsData;
    static create(){
        Card.data = FileIO.getJson('cards');
    }
    static get(id: cardID): Card{
        return new cards[id](id);
    }

    private _name: string;
    constructor(private readonly id: cardID){
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

    abstract routine(data: GameData): subroutine<Routines>;
}
