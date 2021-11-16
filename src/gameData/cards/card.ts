import { routine, subroutine } from "../../routines/routineManager";
import { FileIO } from "../../utils/fileIO";
import { GameData } from "../gameData";
import { cards } from "./cards";

type cardsData = {
    [id: string]: { name: string, price: number, description: string }
};
const undefinedCardData = {
    name: 'undefined card',
    price: 0,
    description: '指定された ID のカードが存在しません\ncards.json が最新の状態ではない可能性があります'
};

class CardsData{
    private data: cardsData;
    constructor(){
        this.data = FileIO.getJson('cards');
    }
    get(id: string){
        return this.data[id] ?? undefinedCardData;
    }
};

export abstract class Card{
    static data: CardsData;
    static create(){
        Card.data = new CardsData();
    }
    static get(id: string): Card{
        return new cards[id](id);
    }

    private _name: string;
    constructor(private readonly id: string){
        this._name = Card.data.get(this.id).name;
    }
    
    get name(){
        return this._name;
    }
    get price(){
        return Card.data.get(this.id).price;
    }
    get description(){
        return Card.data.get(this.id).description;
    }

    abstract subroutine(data: GameData): subroutine;
}
