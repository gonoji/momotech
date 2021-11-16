import { command, EventManager } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { Routine } from "./routines";

export type subroutine<T = routine> = Generator<command, T, unknown>;
export class routine{
    constructor(readonly generator: subroutine<routine>){
    }
}

export class RoutineManager{
    private routine: routine;
    private eventManager: EventManager;
    constructor(data: GameData){
        this.eventManager = new EventManager();
        this.routine = Routine.init(data);
        this.next(data);
    }
    update(data: GameData){
        const done = this.eventManager.update(data);
        if(done) this.next(data, done.result);
    }
    next(data: GameData, eventResult?: unknown){
        const next = this.routine.generator.next(eventResult);
        console.log('>', next.value);
        if(next.done == true){
            this.routine = next.value;
            this.next(data);
        }
        else if(this.eventManager.next(data, next.value)){
            this.next(data);
        }
    }
}
