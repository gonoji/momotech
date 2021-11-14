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
        console.log(command);

        if(command == null) return true;
        if(command == 'end'){
            this.events.popFront().final(data);
            return this.advance(data);
        }
        if(!this.events.includes(command)){
            this.events.pushFront(command);
            command.init(data);
        }
        return false;
    }
}
