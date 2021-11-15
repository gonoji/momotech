import { GameData } from "../gameData/gameData";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { RoutineManager } from "./routineManager";

export type command = GameEvent<unknown> | 'end';

export class EventManager{
    private readonly events: Deque<GameEvent<unknown>>;
    private readonly routine: RoutineManager;
    constructor(data: GameData){
        this.events = new Deque<GameEvent<unknown>>();
        this.routine = new RoutineManager(data);
        this.advance(data);
    }
    update(data: GameData){
        if(KeyManager.down('P')) this.events.print();
        const done = this.events.front().update(data);
        if(done) return this.advance(data, done.result);
        return false;
    }
    private advance(data: GameData, result?: unknown){
        const command = this.routine.next(data, result);

        if(command == null){
            console.log('END');
            return true;
        }
        if(command == 'end'){
            console.log('end');
            this.events.popFront().final(data);
            return this.advance(data);
        }
        if(command == this.events.front()){
            console.log('wait');
            return false;
        }
        if(!this.events.includes(command)){
            console.log('start', command);
            this.events.pushFront(command);
            command.init(data);
            return false;
        }
        throw new Error(`EventManager: 'remove' is not implemented`);
    }
}
