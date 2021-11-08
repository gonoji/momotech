import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameEvent } from "./event";

export class EventDice implements GameEvent{
    private message: Phaser.GameObjects.Text;
    private dices: number[]
    private rolls: boolean;

    /** ダイスを振るイベント
     * @param num ダイスの個数
     * @param event ダイス目の合計値 n を用いて次のイベントを生成する関数
     */
    constructor(num: number, private event: (n: number) => GameEvent){
        this.dices = Array(num).fill(null);
        this.rolls = true;
    }
    init(){
        this.message = SceneManager.scene.add.text(SceneManager.sceneWidth / 2, SceneManager.sceneHeight / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(100);
    }
    update(){
        if(this.rolls){
            for(const i in this.dices){
                this.dices[i] = Math.floor(Math.random() * 6) + 1;
            }
            this.message.setText(this.dices.join(' '));
        }
        if(KeyManager.down('Z')){
            if(!this.rolls) return this.event(this.dices.reduce((x, y) => x + y));
            this.rolls = false;
        }
        return 'continues';
    }
    final(){
        this.message.destroy();
    }
}
