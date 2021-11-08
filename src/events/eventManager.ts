import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

export class EventManager{
    private events: Deque<GameEvent>;
    constructor(event: GameEvent){
        this.events = new Deque<GameEvent>();
        this.push(event);
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
    private push(event: GameEvent){
        this.events.pushFront(event);
        event.init();
    }
}
