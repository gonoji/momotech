import { command } from "./eventManager";
import { GameData } from "../gameData/gameData";
import { init } from "./routines";

export type routine = Generator<command, routine, unknown>;
export type subroutine<T> = Generator<command, T, unknown>;

export class RoutineManager{
    private routine: routine;
    constructor(data: GameData){
        this.routine = init(data);
    }

    next(data: GameData, eventResult?: unknown): command{
        const next = this.routine.next(eventResult);
        if(next.done){
            if(next.value){
                this.routine = next.value;
                return this.next(data);
            }
        }
        return next.value as command;
    }
}
