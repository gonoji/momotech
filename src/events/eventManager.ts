import { GameData } from "../gameData/gameData";
import { Deque } from "../utils/deque";
import { KeyManager } from "../utils/keyManager";
import { GameEvent } from "./event";

export type command = GameEvent<unknown> | 'end';

export class EventManager{
    private readonly events: Deque<GameEvent<unknown>>;
    constructor(){
        this.events = new Deque<GameEvent<unknown>>();
    }
    update(data: GameData){
        if(KeyManager.down('P')) this.events.print();
        return this.events.front()?.update(data);
    }
    /**
     * @returns 再度ルーチンを進めてイベントを更新する必要があるかどうか
     */
    next(data: GameData, command: command){
        if(command == 'end'){
            console.log('end');
            this.events.popFront()?.final(data);
            return true;
        }
        if(command == this.events.front()){
            console.log('wait');
            return false;
        }
        if(!this.events.includes(command)){
            console.log('start', command);
            this.events.pushFront(command);
            command.init(data);
            return false;
        }
        throw new Error(`EventManager: 'remove' is not implemented`);
    }
}
