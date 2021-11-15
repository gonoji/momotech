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
        if(KeyManager.down('Z')  || !this.rolls){
            if(!this.rolls) return { result: this.dices.reduce((x, y) => x + y) };
            this.rolls = false;
            // animeupdateをしたい
        }
    }
    final(){
        this.message.destroy();
    }


    private dicePict : Phaser.GameObjects.Arc[];
    dicePosition(numDice: number){
        const frameRoll = 60;
        const frameBounce1 : number[] = [];
        const frameBounce2 : number[] = [];
        const height1 : number[] = [];
        const height2 : number[] = [];

        for(let i = 0; i < numDice; i ++){
            //gIDs[i] = (IndexRoll, NumIndex-1);
            height1[i] = 150+ Math.random();
            height2[i] = height1[i] / 5;
            frameBounce1[i] = frameRoll/2 + 6*Math.random();
            frameBounce2[i] = frameRoll*3/4 + 4*Math.random();
        }

    }
}
