import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { Routine } from "../../routines/routine";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";

export class StationMinus extends Station{
    constructor(data: stationData, x: number = 0, y: number = 0, z: number = 0, id: number = -1){
        super(data, x, y, z, 'minus', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('マイナス駅に止まった');
        const loss = yield* Routine.execute(new EventRoulette(StationMinus.loss(gameData), GameData.moneyToText));
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
