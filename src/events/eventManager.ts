import { GameData } from "../gameData/gameData";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { RoutineManager } from "./routineManager";

export type command = GameEvent<unknown> | 'end' | 'wait';

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
        return this.events.front().update(this.gameData) && this.advance();
    }
    private advance(){
        const command = this.routine.next();
        console.log(command);

        if(command == null) return true;
        if(command == 'wait') return false;
        if(command == 'end'){
            this.events.popFront().final();
            return this.advance();
        }
        this.events.pushFront(command);
        command.init();
        return false;
    }
}
