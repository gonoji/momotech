import { EventMessage } from "../../events/eventMessage";
import { cardID } from "../cards/card";
import { GameData } from "../gameData";
import { Station, stationBaseData } from "./station";

export type stationShopData = { cards: cardID[] } & stationBaseData;

export class StationShop extends Station{
    cards: cardID[];
    constructor(data: stationShopData){
        super(data);
        this.cards = data.cards;
    }
    *routine(data: GameData){
        yield new EventMessage('まだ実装してない');
        yield 'end';
    }
    toJSON(){
        return { ...super.toJSON(), cards: this.cards };
    }

}