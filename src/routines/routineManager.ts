import { command, EventManager } from "../events/eventManager";
import { GameData } from "../gameData/gameData";
import { Routine, RoutineInit } from "./routines";

export type subroutine<T = routine> = Generator<command, T>;
export class routine{
    constructor(readonly generator: subroutine){
    }
}

type new_routine = Generator<command, new_routine>;
type new_subroutine<T> = Generator<command, T>;

export abstract class RoutineClass implements new_routine{
    private readonly generator: Generator<command, RoutineClass>;
    protected abstract routine(data: GameData): typeof this.generator;
    constructor(data: GameData){
        this.generator = this.routine(data);
    }
    next(args?: unknown){
        return this.generator.next(args);
    }
    return(value: RoutineClass){
        return this.generator.return(value);
    }
    throw(e: any){
        return this.generator.throw(e);
    }
    [Symbol.iterator](){
        return this.generator[Symbol.iterator]();
    }
}

export class RoutineManager{
    private routine: RoutineClass;
    private eventManager: EventManager;
    constructor(data: GameData){
        this.eventManager = new EventManager();
        this.routine = new RoutineInit(data);
        this.next(data);
    }
    update(data: GameData){
        const done = this.eventManager.update(data);
        if(done) this.next(data, done.result);
    }
    next(data: GameData, eventResult?: unknown){
        const next = this.routine.next(eventResult);
        if(next.done == true){
            this.routine = next.value;
            this.next(data);
        }
        else if(this.eventManager.next(data, next.value)){
            this.next(data);
        }
    }
}
