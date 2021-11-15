import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { execute } from "../../events/routines";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station } from "./station";
import { cards } from "../cards/cards";
import { Card } from "../cards/card";

export class StationCard extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'card', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('カード駅に止まった');
        const id = yield* execute(new EventRoulette(StationCard.getCard(gameData), (id) => Card.data[id].name));
        yield 'end';
        yield 'end';
        gameData.turnPlayer.cards.push(Card.get(id));
        yield new EventMessage(Card.data[id].name + 'を手に入れた');
        yield 'end';
    }

    private static getCard(gameData: GameData){
        return () => Util.pick(Object.keys(cards));
    }
}