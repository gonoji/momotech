import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

type command = 'pop';

export class EventManager{
    private events: Deque<GameEvent<unknown>>;
    constructor(private routine: Generator<GameEvent<unknown> | command, void, unknown>){
        this.events = new Deque<GameEvent<unknown>>();
        this.push();
    }
    update(){
        if(KeyManager.down('P')){
            this.events.print();
        }

        const ends = this.events.front().update();
        if(next == 'continues') return 'continues';

        this.events.popFront().final();
        if(next != 'ends') this.push(next);
        return this.events.empty() ? 'ends' : 'continues';
    }
    private push(event: GameEvent){
        this.events.pushFront(event);
        event.init();
    }
    private advance(){
        const next = this.routine.next();
        if(next.done) return;
        const value = next.value;
        if(value == 'pop'){

        }
    }
}
