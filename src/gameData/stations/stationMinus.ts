import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { Routine } from "../../routines/routine";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";

export class StationMinus extends Station{
    constructor(data: stationData | null, x: number = 0, y: number = 0, z: number = 0, id: number | null = null){
        super(data, x, y, z, 'minus', id);
    }
    *routine(gameData: GameData){
        const mes = new EventMessage('マイナス駅に止まった');
        yield mes;
        const loss = yield* Routine.execute(new EventRoulette(StationMinus.loss(gameData), GameData.moneyToText));
        yield mes;
        gameData.turnPlayer.money -= loss;
        yield new EventMessage(GameData.moneyToText(loss) + '失った');
        yield 'end';
        yield 'end';
    }

    private static loss(gameData: GameData){
        return () => Math.floor(Util.getRandomInt(10, 20+1) * gameData.factors.inflation / gameData.factors.season / gameData.factors.business);
    }
}
