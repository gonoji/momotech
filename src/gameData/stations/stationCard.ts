import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";
import { cards } from "../cards/cards";
import { Card } from "../cards/card";
import { Routine } from "../../routines/routine";

export class StationCard extends Station{
    constructor(data: stationData | null, x: number = 0, y: number = 0, z: number = 0, id: number | null = null){
        super(data, x, y, z, 'card', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('カード駅に止まった');
        const id = yield* Routine.execute(new EventRoulette(StationCard.getCard, id => Card.data[id].name));
        yield 'end';
        yield 'end';
        const card = Card.get(id);
        gameData.turnPlayer.cards.push(card);
        yield new EventMessage(card.name + 'を手に入れた');
        yield 'end';
    }

    private static getCard(){
        return Util.pick(Util.keys(cards));
    }
}