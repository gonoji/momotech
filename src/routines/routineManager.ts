import { EventManager } from "../events/eventManager";
import { GameData } from "../gameData/gameData";
import { Routine, Routines } from "./routine";
import { RoutineInit } from "./routineInit";

export class RoutineManager{
    private routine?: Routine<Routines>;
    private eventManager: EventManager;
    constructor(){
        this.eventManager = new EventManager();
    }
    create(data: GameData){
        this.routine = new RoutineInit(data);
        this.next(data);
    }
    update(data: GameData){
        const done = this.eventManager.update(data);
        if(done) this.next(data, done.result);
    }
    next(data: GameData, eventResult?: unknown){
        if(!this.routine) return;
        const next = this.routine.next(eventResult);
        if(next.done == true){
            this.routine = next.value;
            this.next(data);
            return;
        }
        if(this.eventManager.next(data, next.value)){
            this.next(data);
        }
    }
}
