import { GameData } from "../gameData/gameData";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { RoutineManager } from "./routineManager";

export type command = GameEvent<unknown> | 'end';

export class EventManager{
    private readonly events: Deque<GameEvent<unknown>>;
    private readonly routine: RoutineManager;
    constructor(private readonly gameData: GameData){
        this.events = new Deque<GameEvent<unknown>>();
        this.routine = new RoutineManager(gameData);
        this.advance();
    }
    update(){
        if(KeyManager.down('P')) this.events.print();
        const done = this.events.front().update(this.gameData);
        if(done) return this.advance(done.result);
        return false;
    }
    private advance(result?: unknown){
        const command = this.routine.next(this.gameData, result);
        console.log(command);

        if(command == null) return true;
        if(command == 'end'){
            this.events.popFront().final();
            return this.advance();
        }
        if(!this.events.includes(command)){
            this.events.pushFront(command);
            command.init();
        }
        return false;
    }
}
