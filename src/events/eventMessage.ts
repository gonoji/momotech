import { Event } from "./event";
import { KeyManager } from "../utils/keyManager";
import { EventManager } from "./eventManager";

export class EventMessage implements Event{
    private message: Phaser.GameObjects.Text;
    constructor(private text: string, private next?: Event){
    }
    init(){
        const x = Number(EventManager.scene.game.config.width.toString()) / 2;
        const y = Number(EventManager.scene.game.config.height.toString()) / 2;
        this.message = EventManager.scene.add.text(x, y, this.text, {color: 'black', fontSize: '50px'}).setOrigin(0.5).setPadding(0, 10, 0, 0);
    }
    update(){
        if(KeyManager.down('Z')) return this.next ?? 'ends';
        return 'continues';
    }
    final(){
        this.message.destroy();
    }
}