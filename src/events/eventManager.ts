import { GameData } from "../gameData/gameData";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

type command = GameEvent<unknown> | 'end' | 'wait';

export type routine = Generator<command, routine, unknown>;

export class EventManager{
    private events: Deque<GameEvent<unknown>>;
    constructor(private routine: routine){
        this.events = new Deque<GameEvent<unknown>>();
        this.advance();
    }
    update(gameData: GameData){
        if(KeyManager.down('P')) this.events.print();
        return this.events.front().update(gameData) && this.advance();
    }
    private advance(){
        const next = this.routine.next();
        const value = next.value;
        console.log(value);

        if(value == null) return true;
        if(value == 'wait') return false;
        if(value == 'end'){
            this.events.popFront().final();
            return this.advance();
        }

        // routine の更新
        if('next' in value){
            this.routine = value;
            return this.advance();
        }
        
        // event の更新
        this.events.pushFront(value);
        value.init();
        return false;
    }
}
