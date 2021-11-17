import { subroutine } from "../../routines/routine";
import { Direction } from "../../utils/direction";
import { Exportable } from "../../utils/exportable";
import { SceneManager } from "../../utils/sceneManager";
import { Util } from "../../utils/util";
import { Field, FieldInGame } from "../field";
import { GameData } from "../gameData";

export type stationType = 'plus' | 'minus' | 'card' | 'estate';
export type stationData = {
    id: number,
    type: string,
    position: {
        x: number,
        y: number
    },
    nexts: {
        up: number,
        down: number,
        right: number,
        left: number
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
    update(){

    }
    final(){
        this.sprite.destroy();
    }

    passable(dir: Direction.asType, field: FieldInGame){
        const dest = this.nexts[dir];
        return dest && !field.spiritRocks.find(rock => rock.station == dest);
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
    toJSON(): object{
        return this.data;
    }

    abstract routine(gameData: GameData): subroutine<void>;
}
