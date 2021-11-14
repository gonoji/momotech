import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { SceneManager } from "../utils/sceneManager";

const routineStation = 'station' as const;
const routineView = 'view' as const;

export class EventMove implements GameEvent<typeof routineStation | typeof routineView>{
    private dirHistory: Direction.asType[] = [];
    private textStepsLeft: Phaser.GameObjects.Text;
    /** プレイヤーがフィールド上を移動するイベント
     * @param steps 何マス進むか
     */
    constructor(private readonly steps: number){
    }
    init(){
        const layer = SceneManager.layer('dialog');
        this.textStepsLeft = layer.add.text(layer.width / 2, layer.height / 2, `のこり${this.steps}マス`, {color: 'black', fontSize: '50px'})
            .setPadding(0, 10, 0, 0)
            .setOrigin(0.5)
            .setDepth(1);
    }
    /**
     * @returns 次のルーチン名
     */
    update(gameData: GameData){
        for(const dir of Direction.asArray){
            if(KeyManager.down(dir)){
                if(dir == Direction.opposite(this.dirHistory[this.dirHistory.length-1])){ // 来た道を戻っている
                    if(gameData.turnPlayer.moveTo(dir)){
                        this.dirHistory.pop();
                    }
                }
                else if(gameData.turnPlayer.canMove(dir)){ // 来た道以外に進んでいて、要石がない
                    if(gameData.turnPlayer.moveTo(dir)){
                        this.dirHistory.push(dir);
                    }
                }
                this.textStepsLeft.setText(`のこり${this.stepsLeft}マス`);
            }
        }
        if(this.stepsLeft == 0) return { result: routineStation };
        if(KeyManager.down('C')) return { result: routineView };
    }
    final(){
        this.textStepsLeft.destroy();
    }

    get stepsLeft(){
        return this.steps - this.dirHistory.length;
    }
}