import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

type command = GameEvent<unknown> | 'end';
export type routine = Generator<command, command, unknown>;

export class EventManager{
    private events: Deque<GameEvent<unknown>>;
    constructor(private routine: routine){
        this.events = new Deque<GameEvent<unknown>>();
        this.advance();
    }
    update(){
        if(KeyManager.down('P')) this.events.print();
        return this.events.front().update() && this.advance();
    }
    private advance(){
        const next = this.routine.next();
        console.log(next.value);
        if(next.value === undefined) return true;
        const value = next.value;
        switch(value){
        case 'end':
            this.events.popFront().final();
            return this.advance();
        default:
            this.events.pushFront(value);
            value.init();
        }
        return next.done;
    }
}
