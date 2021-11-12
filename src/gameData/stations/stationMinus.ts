import { result } from "../../events/event";
import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station } from "./station";

export class StationMinus extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'minus', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('マイナス駅に止まった');
        const loss = yield* result(new EventRoulette(() => Util.pick([10, 20, 30]), GameData.moneyToText));
        yield 'end';
        yield 'end';
        gameData.turnPlayer.money -= loss;
        yield new EventMessage(GameData.moneyToText(loss) + '失った');
        yield 'end';
    }
}
