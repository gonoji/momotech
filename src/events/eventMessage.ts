import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Depth } from "../utils/depthManager";

export class EventMessage implements GameEvent<void>{
    private message: Phaser.GameObjects.Text;
    private box: Phaser.GameObjects.Rectangle;
    private index = 0;

    /** メッセージを表示するイベント
     * @param text メッセージの内容
     * @param event 次のイベント
     */
    constructor(private text: string){
    }
    init(){
        const width = SceneManager.sceneWidth;
        const height = SceneManager.sceneHeight;
        this.message = SceneManager.scene.add.text(0.05 * width, 0.7 * height, '', {color: 'black', fontSize: '50px'})
            .setPadding(0, 10, 0, 0)
            .setDepth(Depth.of('dialog', 1));
        this.box = SceneManager.scene.add.rectangle(0.5 * width, 0.8 * height, 0.95 * width, 0.3 * height, 0x000088, 0.5)
            .setStrokeStyle(4, 0x080808)
            .setOrigin(0.5)
            .setDepth(Depth.of('dialog', 0));
    }
    update(){
        if(this.index < this.text.length){
            if(KeyManager.down('Z')){
                this.index = this.text.length;
                return false;
            }
            else this.index += 0.5;
        }
        this.message.setText(this.text.substr(0, this.index));
        return KeyManager.down('Z');
    }
    result(){
    }
    final(){
        this.message.destroy();
        this.box.destroy();
    }
}
