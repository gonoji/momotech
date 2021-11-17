import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { Routine } from "../../routines/routine";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station, stationData } from "./station";

export class StationPlus extends Station{
    constructor(data: stationData, x: number = 0, y: number = 0, z: number = 0, id: number = -1){
        super(data,x, y, z, 'plus', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('プラス駅に止まった');
        const gain = yield* Routine.execute(new EventRoulette(StationPlus.gain(gameData), GameData.moneyToText));
        yield 'end';
        yield 'end';
        gameData.turnPlayer.money += gain;
        yield new EventMessage(GameData.moneyToText(gain) + '手に入れた');
        yield 'end';
    }

    private static gain(gameData: GameData){
        return () => Math.floor(Util.getRandomInt(10, 20+1) * gameData.factors.inflation * gameData.factors.season * gameData.factors.business);
    }
}