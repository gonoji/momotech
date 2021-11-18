import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { Window } from "../utils/window";

/** メッセージを表示するイベント
 * @param text メッセージの内容
 * @param event 次のイベント
 */
export class EventMessage implements GameEvent<void>{
    private window?: Window;
    private index = 0;
    constructor(private text: string){
    }
    init(){
        this.window = Window.lower();
    }
    /**
     * @returns なし
     */
    update(){
        if(this.index < this.text.length){
            if(KeyManager.down('Z')){
                this.index = this.text.length;
                return;
            }
            else this.index += 0.5;
        }
        this.window?.setTexts(this.text.substr(0, this.index).split('\n'));
        if(KeyManager.down('Z')) return { result: undefined };
    }
    final(){
        this.window?.final();
    }
}
