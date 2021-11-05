import { Events } from "./events"
import { EventMessage } from "./eventMessage";
import { EventChoose } from "./eventChoose";

export class EventTest extends Events{
    constructor(){
        super(new EventMessage('message',
            new EventChoose()
                .setChoice('choice #1', new EventMessage("result #1"))
                .setChoice('choice #2', new EventMessage("result #2"))
        ));
    }
}
