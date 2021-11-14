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
        const layer = SceneManager.layer('dialog');
        this.message = layer.add.text(layer.width / 2, layer.height / 2, '', {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(0);
    }
    /**
     * @returns 出目の和
     */
    update(){
        if(this.rolls){
            for(const i in this.dices){
                this.dices[i] = Math.floor(Math.random() * 6) + 1;
            }
            this.message.setText(this.dices.join(' '));
        }
        if(KeyManager.down('Z')){
            if(!this.rolls) return { result: this.dices.reduce((x, y) => x + y) };
            this.rolls = false;
        }
    }
    final(){
        this.message.destroy();
    }
}
