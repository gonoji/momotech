import { SceneManager } from "../utils/sceneManager";
import { Field } from "./field";
import { StationEstate } from "./stations/stationEstate";

export class Destination{
    private marker?: Phaser.GameObjects.Star;
    constructor(public location: StationEstate){
        const pos = Field.at(location.x, location.y);
        const r = 54;
        this.marker = SceneManager.layer('field').add.star(pos.x, pos.y, 5, r, r * Math.sin(54 * 2*Math.PI / 360), 0x000000, 0)
        .setStrokeStyle(4, 0xff0000)
        .setOrigin(0.5)
        .setDepth(16)
    }
    update(){
        if(!this.marker) return;
        this.marker.angle /*[deg]*/ += 360/*[deg]*/ / 10/*[s]*/ / 60/*[f/s]*/ * 1/*[f]*/;
    }
    final(){
        this.marker?.destroy();
    }
}
