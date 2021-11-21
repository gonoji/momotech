import { GameData } from "../gameData/gameData";
import { GameEvent } from "./event";

export class EventList{
    private readonly events: GameEvent[] = [];

    push(event: GameEvent, data: GameData){
        this.events.push(event);
        event.init(data);
    }
    pop(data: GameData){
        this.events.pop()?.final(data);
    }
    remove(event: GameEvent, data: GameData){
        const index = this.events.indexOf(event);
        if(index == -1) return false;
        this.events.splice(index, 1);
        event.final(data);
        return true;
    }
    get last(){
        return this.events[this.events.length-1];
    }

    empty(){
        return this.events.length == 0;
    }
    includes(event: GameEvent){
        return this.events.includes(event);
    }

    print(){
        console.log(this.events);
    }
}
