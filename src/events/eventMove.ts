import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { Window } from "../utils/window";

const routineStation = 'station' as const;
const routineView = 'view' as const;

/** プレイヤーがフィールド上を移動するイベント
 * @param steps 何マス進むか
 */
 export class EventMove implements GameEvent<typeof routineStation | typeof routineView>{
    private dirHistory: Direction.asType[] = [];
    private window?: Window;
    constructor(private readonly steps: number){
    }
    init(data: GameData){
        const margin = 30;
        this.window = new Window(margin, margin, 0, [EventMove.stepsText(10)]);
        this.window.setTexts([EventMove.stepsText(this.stepsLeft)]);
    }
    /**
     * @returns 次のルーチン名
     */
    update(data: GameData){
        for(const dir of Direction.asArray){
            if(KeyManager.down(dir)){
                if(dir == Direction.opposite(this.dirHistory[this.dirHistory.length-1])){ // 来た道を戻っている
                    if(data.turnPlayer.moveTo(dir)){
                        this.dirHistory.pop();
                    }
                }
                else if(data.turnPlayer.location.passable(dir, data.field)){ // 来た道以外に進んでいて、要石がない
                    if(data.turnPlayer.moveTo(dir)){
                        this.dirHistory.push(dir);
                    }
                }
                this.window?.setTexts([EventMove.stepsText(this.stepsLeft)]);
            }
        }
        if(this.stepsLeft == 0) return { result: routineStation };
        if(KeyManager.down('C')) return { result: routineView };
    }
    final(){
        this.window?.final();
    }

    static stepsText(steps: number){
        return `残り ${steps < 10? ' ': ''}${steps} マス`;
    }

    get stepsLeft(){
        return this.steps - this.dirHistory.length;
    }
    get from(){
        return Direction.opposite(this.dirHistory[this.dirHistory.length-1]);
    }
}
