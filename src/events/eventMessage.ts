import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Window } from "../utils/window";

export class EventMessage implements GameEvent<void>{
    private message: Phaser.GameObjects.Text;
    private window: Window;
    private index = 0;

    /** メッセージを表示するイベント
     * @param text メッセージの内容
     * @param event 次のイベント
     */
    constructor(private text: string){
    }
    init(){
        const layer = SceneManager.layer('dialog');
        this.window = new Window(0.5 * layer.width, 0.8 * layer.height, 0.95 * layer.width, 0.3 * layer.height);
        this.message = layer.add.text(0.05 * layer.width, 0.7 * layer.height, '', {color: 'black', fontSize: '50px'})
            .setPadding(0, 10, 0, 0)
            .setDepth(1);
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
        this.message.setText(this.text.substr(0, this.index));
        if(KeyManager.down('Z')) return { result: undefined };
    }
    result(){
    }
    final(){
        this.window.final();
        this.message.destroy();
    }
}
