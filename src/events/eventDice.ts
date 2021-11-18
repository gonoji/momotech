import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameEvent } from "./event";

export namespace EventDice{

    /** ダイスを振るイベント（キャンセル不可能）
     * @param num ダイスの個数
     * @returns 出目の和
     */
    export class Forced implements GameEvent<number>{
        private message?: Phaser.GameObjects.Text;
        private dices: number[]
        rolls: boolean = true;
        constructor(num: number){
            this.dices = Array(num).fill(null);
        }
        init(){
            const layer = SceneManager.layer('dialog');
            this.message = layer.add.text(layer.width / 2, layer.height / 2, '', {color: 'black', fontSize: '50px'})
                .setOrigin(0.5)
                .setPadding(0, 10, 0, 0)
                .setDepth(0);
        }
        update(){
            if(this.rolls){
                for(const i in this.dices){
                    this.dices[i] = Math.floor(Math.random() * 6) + 1;
                }
                this.message?.setText(this.dices.join(' '));
            }
            if(KeyManager.down('Z')){
                if(!this.rolls) return { result: this.dices.reduce((x, y) => x + y) };
                this.rolls = false;
            }

            // デバッグ用：押した数字キーに対応する数を出す
            for(let n = 0; n <= 9; n++){
                if(KeyManager.down(KeyManager.numberToKey(n))) return { result: n };
            }
        }
        final(){
            this.message?.destroy();
        }
    }

    /** ダイスを振るイベント（キャンセル可能）
     * @param num ダイスの個数
     * @returns ダイスを振ったら出目の和、振らなかったら `null`
     */
    export class CanCancel implements GameEvent<number | null>{
        private inner: Forced;
        constructor(num: number){
            this.inner = new Forced(num);
        }
        init(){
            this.inner.init();
        }
        update(){
            if(KeyManager.down('X') && this.inner.rolls) return { result: null };
            return this.inner.update();
        }
        final(){
            this.inner.final();
        }
    }
}
