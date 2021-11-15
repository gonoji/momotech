import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { execute } from "../../events/routines";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station } from "./station";

export class StationMinus extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'minus', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('マイナス駅に止まった');
        const loss = yield* execute(new EventRoulette(StationMinus.loss(gameData), GameData.moneyToText));
        yield 'end';
        yield 'end';
        gameData.turnPlayer.money -= loss;
        yield new EventMessage(GameData.moneyToText(loss) + '失った');
        yield 'end';
    }

    private static loss(gameData: GameData){
        return () => Math.floor(Util.getRandomInt(10, 20+1) * gameData.factors.inflation / gameData.factors.season / gameData.factors.business);
    }
}
