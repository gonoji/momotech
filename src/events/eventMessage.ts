import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { EventManager } from "./eventManager";
import { SceneManager } from "../utils/sceneManager";

export class EventMessage implements GameEvent{
    private message: Phaser.GameObjects.Text;
    private box: Phaser.GameObjects.Rectangle;
    private nanmojime = 0;
    private scene = SceneManager.getCurrentScene();
    private x = Number(this.scene.game.config.width.toString()) / 2;
    private y = Number(this.scene.game.config.height.toString()) / 2;



    /** メッセージを表示するイベント
     * @param text メッセージの内容
     * @param event 次のイベント
     */
    constructor(private text: string, private next?: GameEvent){
    }
    init(){

        
        /*
        this.message = scene.add.text(x, y, this.text, {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(100);
        */
        
        // 箱を作ろう
        this.box = this.scene.add.rectangle(this.x, this.y, 2*this.x, 2*this.y, 0x00ff00, 0.5)
            .setOrigin(0.5)
            .setDepth(100);
        // メッセージの長さを知ろう
        const messageLength = this.text.length;
        //

    }
    update(){
        let textOnScreen;
        if(this.nanmojime < this.text.length && !KeyManager.down('Z')){
            this.nanmojime+=0.5;
            textOnScreen = this.text.substr(0, this.nanmojime); 
        }
        else{
            textOnScreen = this.text;
        }
        if(KeyManager.down('X')){
            this.message.destroy();
        this.message = this.scene.add.text(this.x, this.y, textOnScreen, {color: 'black', fontSize: '50px'})
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0)
            .setDepth(100);

        } 
        
        
        
        if(KeyManager.down('Z')) return this.next ?? 'ends';
        return 'continues';
    }
    final(){
        this.message.destroy();
    }
}