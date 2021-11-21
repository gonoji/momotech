import { cardID } from "../cards/card";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";

export class StationShop extends Station{
    cardsData: cardID[];
    constructor(data: stationData | null, x: number = 0, y: number = 0, z: number = 0, id: number | null = null){
        super(data,x, y, z, 'shop', id);
        this.cardsData = [];
        this.readCardData(data);
        /*this.cardsData.push('Dice3');
        for(let i = 0; i < this.cardsData.length;i++){
            console.log(this.cardsData[i]);
        }*/
    }
    *routine(gameData: GameData){

    }
    private readCardData(data: any){
        if(data!=null && data.cards != null)
            for(const card of data.cards)
                this.cardsData.push(card);
    }
    toJSON(){
        return {...this.data, ...{cards: this.cardsData}};
    }

}