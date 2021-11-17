import { GameEvent } from "../events/event";
import { EventChoose } from "../events/eventChoose";
import { command } from "../events/eventManager";
import { GameData } from "../gameData/gameData";

export type subroutine<T> = Generator<command, T>;

export abstract class Routine<T> implements subroutine<T>{
    private readonly generator: Generator<command, T>;
    protected abstract routine(data: GameData): typeof this.generator;
    constructor(data: GameData){
        this.generator = this.routine(data);
    }
    next(args?: unknown){
        return this.generator.next(args);
    }
    return(value: T){
        return this.generator.return(value);
    }
    throw(e: any){
        return this.generator.throw(e);
    }
    [Symbol.iterator](){
        return this.generator[Symbol.iterator]();
    }

    static *execute<T>(event: GameEvent<T>){
        return (yield event) as T;
    }
    static *askYesNo(){
        const choice = yield* Routine.execute(new EventChoose(['はい', 'いいえ'] as const));
        yield 'end';
        return choice == 'はい';
    }
    
}

export type Routines = Routine<Routines>;
