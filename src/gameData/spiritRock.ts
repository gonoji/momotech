import { EventMessage } from "../events/eventMessage";
import { subroutine } from "../events/routineManager";
import { SceneManager } from "../utils/sceneManager";
import { Util } from "../utils/util";
import { Field } from "./field";
import { GameData } from "./gameData";
import { Station } from "./stations/station";

export class SpiritRock{
    private sprite: Phaser.GameObjects.Text;
    private duration: number;
    constructor(station: Station){
        const pos = Field.at(station.x, station.y);
        this.sprite = SceneManager.layer('field').add.text(pos.x, pos.y, '要', { fontSize: '80px', color: 'black' })
            .setOrigin(0.5)
            .setPadding(0, 10, 0, 0);
        this.duration = Util.pick([5, 6, 7]);
    }
    *weather(field: Field): subroutine<void>{
        if(--this.duration == 0){
            SceneManager.layer('field').cameras.main.setScroll(this.sprite.x, this.sprite.y);
            field.removeSpiritRock(this);
            yield new EventMessage('要石が消えた');
            yield 'end';
        }
    }
    final(){
        this.sprite.destroy();
    }
}