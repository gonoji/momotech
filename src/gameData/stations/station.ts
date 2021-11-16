import { subroutine } from "../../events/routineManager";
import { Direction } from "../../utils/direction";
import { Exportable } from "../../utils/exportable";
import { SceneManager } from "../../utils/sceneManager";
import { Util } from "../../utils/util";
import { Field } from "../field";
import { GameData } from "../gameData";

export type stationType = 'plus' | 'minus' | 'card' | 'estate';
export type stationData = {
    id : number,
    type : string,
    position : {
        x : number,
        y : number
    },
    nexts : {
        up : number,
        down : number,
        right : number,
        left : number
    }
};
export abstract class Station implements Exportable{
    static size: number = 64;
    private static id_max: number = 2147483647;

    private sprite: Phaser.GameObjects.Sprite;
    readonly nexts: { [dir in Direction.asType]: Station };
    constructor(
        public data: stationData,
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        readonly stationType: stationType = 'plus',
        public id: number = -1
    ){
        if(this.data == null){
            this.data = {
                id: this.id,
                type: this.stationType,
                position: {x: x, y: y},
                nexts: {up: null, down: null, right: null, left: null} 
            }
            if(id == -1) this.data.id = Util.getRandomInt(0, Station.id_max);
        }
        const layer = SceneManager.layer('field');
        this.sprite = layer.add.sprite(0, 0, this.data.type).setDepth(0);
        this.sprite.setDisplaySize(Station.size, Station.size);
        this.nexts = { UP: null, DOWN: null, LEFT: null, RIGHT: null };
        this.x = this.data.position.x;
        this.y = this.data.position.y;
        const pos = Field.at(this.x,this.y);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.id = this.data.id;
    }

    toJSON (): any{
        return this.data;
    }
    update(){

    }
    final(){
        this.sprite.destroy();
    }
    setNext(dir: Direction.asType, other: Station){
        this.nexts[dir] = other;
        this.data.nexts[dir] = other.id;
        other.nexts[Direction.opposite(dir)] = this;
        other.data.nexts[Direction.opposite(dir)] = this.id;
    }
    removeNext(dir: Direction.asType, other: Station){
        this.nexts[dir] = null;
        this.data.nexts[dir] = null;
        other.nexts[Direction.opposite(dir)] = null;
        other.data.nexts[Direction.opposite(dir)] = null;
    }

    abstract subroutine(gameData: GameData): subroutine<void>;
}
