import { GameEvent } from "../../events/event";
import { EventMessage } from "../../events/eventMessage";
import { Card } from "./card";

export class cardTest extends Card{
    constructor(){
        super("test");
    }
    event(): GameEvent<unknown> {
        return null;
    }

}