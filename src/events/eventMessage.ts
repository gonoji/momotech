import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { EventManager } from "./eventManager";
import { SceneManager } from "../utils/sceneManager";

export class EventMessage implements GameEvent{
    private message: Phaser.GameObjects.Text;
    private box: Phaser.GameObjects.Rectangle;
    private nanmojime = 0;
    private scene = SceneManager.getCurrentScene();
    private width = Number(this.scene.game.config.width.toString());
    private height = Number(this.scene.game.config.height.toString());



    /** メッセージを表示するイベント
     * @param text メッセージの内容
     * @param event 次のイベント
     */
    constructor(private text: string, private next?: GameEvent){
    }
    init(){

        
        
        this.message = this.scene.add.text(0.05*this.width, 0.7*this.height, '', {color: 'black', fontSize: '50px'})
            .setPadding(0, 10, 0, 0)
            .setDepth(100);
        
        // 箱を作ろう
        this.box = this.scene.add.rectangle(0.5*this.width, 0.8*this.height, 0.95*this.width, 0.3*this.height, 0x000088, 0.5)
            .setStrokeStyle(4, 0x080808)
            .setOrigin(0.5)
            .setDepth(99);
        // メッセージの長さを知ろう
        const messageLength = this.text.length;
        //

    }
    update(){
        let textOnScreen;
        if(this.nanmojime < this.text.length){
            if(!KeyManager.down('Z')){
                this.nanmojime+=0.5;//0.25;
                textOnScreen = this.text.substr(0, this.nanmojime); 
            }else{
                this.nanmojime = this.text.length;
                return 'continues';

            }
        }
        else{
            textOnScreen = this.text;
        }
        this.message.setText(textOnScreen);
        
        
        if(KeyManager.down('Z')) return this.next ?? 'ends';
        return 'continues';
    }
    final(){
        this.message.destroy();
        this.box.destroy();
    }
}