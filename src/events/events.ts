import { Event } from "./event";
import { EventManager } from "./eventManager";

export abstract class Events implements Event{
    protected eventManager: EventManager;
    constructor(event: Event){
        this.eventManager = new EventManager(event);
    }
    init(){
    }
    update(){
        return this.eventManager.update();
    }
    final(){
    }
}
