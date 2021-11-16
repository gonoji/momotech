import { SceneManager } from "../utils/sceneManager";
import { Util } from "../utils/util";
import { Field } from "./field";
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
    final(){
        this.sprite.destroy();
    }

    focus(){
        SceneManager.layer('field').cameras.main.setScroll(this.sprite.x, this.sprite.y);
    }
    weather(){
        return --this.duration == 0;
    }
}