import { TitleScene } from "../scenes/titleScene";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { Event } from "./event";

export class EventManager{
    static scene: Phaser.Scene;
    private events: Deque<Event>;
    constructor(event: Event){
        this.events = new Deque<Event>();
        this.push(event);
    }
    static init(scene: Phaser.Scene){
        EventManager.scene = scene;
    }
    update(){
        if(KeyManager.down('P')){
            this.events.print();
        }

        const next = this.events.front().update();
        if(next == 'continues') return 'continues';

        this.events.popFront().final();
        if(next != 'ends') this.push(next);
        return this.events.empty() ? 'ends' : 'continues';
    }
    private push(event: Event){
        this.events.pushFront(event);
        event.init();
    }
}
