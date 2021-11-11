import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

export class EventMove implements GameEvent<void>{
    /** プレイヤーがフィールド上を移動するイベント
     * @param steps 何マス進むか
     */
    constructor(private steps: number){
    }
    init(){
    }
    update(gameData: GameData){
        for(const dir of Direction.asArray){
            if(KeyManager.down(dir)){
                if(gameData.turnPlayer.moveTo(dir)) this.steps--;
            }
        }
        return this.steps <= 0;
    }
    result(){
    }
    final(){
    }
    
}