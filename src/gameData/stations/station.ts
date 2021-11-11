import { GameEvent } from "../../events/event";
import { Depth } from "../../utils/depthManager";
import { Direction } from "../../utils/direction";
import { Exportable } from "../../utils/exportable";
import { SceneManager } from "../../utils/sceneManager";
import { Util } from "../../utils/util";
import { Field } from "../field";

type stationType = 'plus' | 'minus';

export abstract class Station implements Exportable{
    static size: number = 128;
    private static id_max: number = 2147483647;

    private sprite: Phaser.GameObjects.Sprite;
    readonly nexts: { [dir in Direction.asType]: Station };
    constructor(
        public x: number,
        public y: number,
        public z: number,
        readonly stationType: stationType,
        public id: number = -1
    ){
        if(id == -1) this.id = Util.getRandomInt(Station.id_max);
        this.sprite = SceneManager.scene.add.sprite(x, y, stationType).setDepth(Depth.of('field', 0));
        this.nexts = { UP: null, DOWN: null, LEFT: null, RIGHT: null };
        [this.sprite.x, this.sprite.y] = Field.at(x, y);
    }
    export(): JSON {
        return JSON.parse(`{"id" : ${this.id},"type" : "${this.stationType}","position" : {"x" : ${this.x}, "y" : ${this.y}},"nexts": { "up" : "${this.nexts.UP?.id}", "down": "${this.nexts.DOWN?.id}", "right": "${this.nexts.RIGHT?.id}", "left": "${this.nexts.LEFT?.id}"}}`);
    }
    update(){

    }
    final(){
        this.sprite.destroy();
    }
    setNext(dir: Direction.asType, other: Station){
        this.nexts[dir] = other;
        other.nexts[Direction.opposite(dir)] = this;
    }
    abstract event(): GameEvent<unknown>;
}