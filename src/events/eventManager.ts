import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";
import { EventList } from "./eventList";

export type command = GameEvent | 'end';

export class EventManager{
    private readonly events = new EventList();

    update(data: GameData){
        if(KeyManager.down('P')) this.events.print();
        return this.events.last.update(data);
    }
    /**
     * @returns 再度ルーチンを進めてイベントを更新する必要があるかどうか
     */
    next(data: GameData, command: command){
        if(command == 'end'){
            console.log('end');
            this.events.pop(data);
            return true;
        }
        if(command == this.events.last){
            console.log('wait');
            return false;
        }
        if(!this.events.includes(command)){
            console.log('start', command);
            this.events.push(command, data);
            return false;
        }
        console.log('remove', command);
        this.events.remove(command, data);
        return true;
    }
}
