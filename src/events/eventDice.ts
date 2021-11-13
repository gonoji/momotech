import { Depth } from "../utils/depthManager";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameEvent } from "./event";

export class EventDice implements GameEvent<number>{
    private message: Phaser.GameObjects.Text;
    private dices: number[]
    private rolls: boolean;

    /** ダイスを振るイベント
     * @param num ダイスの個数
     */
    constructor(num: number){
        this.dices = Array(num).fill(null);
        this.rolls = true;
    }
    init(){
        this.message = SceneManager.scene.add.text(SceneManager.scene.width / 2, SceneManager.scene.height / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(Depth.of('dialog', 0));
    }
    update(){
        if(this.rolls){
            for(const i in this.dices){
                this.dices[i] = Math.floor(Math.random() * 6) + 1;
            }
            this.message.setText(this.dices.join(' '));
        }
        if(KeyManager.down('Z')){
            if(!this.rolls) return true;
            this.rolls = false;
        }
        return;
    }
    result(){
        return this.dices.reduce((x, y) => x + y);
    }
    final(){
        this.message.destroy();
    }
}
