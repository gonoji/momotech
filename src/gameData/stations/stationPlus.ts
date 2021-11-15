import { EventMessage } from "../../events/eventMessage";
import { EventRoulette } from "../../events/eventRoulette";
import { execute } from "../../events/routines";
import { Util } from "../../utils/util";
import { GameData } from "../gameData";
import { Station } from "./station";

export class StationPlus extends Station{
    constructor(x: number, y: number, z: number = 0, id: number = -1){
        super(x, y, z, 'plus', id);
    }
    *routine(gameData: GameData){
        yield new EventMessage('プラス駅に止まった');
        const gain = yield* execute(new EventRoulette(StationPlus.gain(gameData), GameData.moneyToText));
        yield 'end';
        yield 'end';
        gameData.turnPlayer.money += gain;
        yield new EventMessage(GameData.moneyToText(gain) + '手に入れた');
        yield 'end';
    }

    private static gain(gameData: GameData){
        return () => Util.getRandomInt(10, 20+1) * gameData.factors.inflation * gameData.factors.season * gameData.factors.business;
    }
}