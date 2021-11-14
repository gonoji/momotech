import { GameData } from "../gameData/gameData";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { SceneManager } from "../utils/sceneManager";

export class EventMove implements GameEvent<void>{
    private dirHistory: Direction.asType[] = [];
    private textStepsLeft: Phaser.GameObjects.Text;
    /** プレイヤーがフィールド上を移動するイベント
     * @param steps 何マス進むか
     */
    constructor(private steps: number){
    }
    init(){
        const layer = SceneManager.layer('dialog');
        this.textStepsLeft = layer.add.text(layer.width / 2, layer.height / 2, `のこり${this.steps}マス`, {color: 'black', fontSize: '50px'})
            .setPadding(0, 10, 0, 0)
            .setOrigin(0.5)
            .setDepth(1);
    }

    update(gameData: GameData){
        for(const dir of Direction.asArray){
            if(KeyManager.down(dir)){
                if(dir == Direction.opposite(this.dirHistory[this.dirHistory.length-1])){ //来た道を戻っている
                    if(gameData.turnPlayer.moveTo(dir)){
                        this.steps++;
                        this.dirHistory.pop();
                    }
                }
                else if(gameData.turnPlayer.canMove(dir)){ //来た道以外に進んでいて、要石がない
                    if(gameData.turnPlayer.moveTo(dir)){
                        this.steps--;
                        this.dirHistory.push(dir);
                    }
                }
                this.textStepsLeft.setText(`のこり${this.steps}マス`);
            }
        }
        return this.steps <= 0;
    }
    result(){
    }
    final(){
        this.textStepsLeft.destroy();
    }

}