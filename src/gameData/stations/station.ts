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
    type: stationType,
    position: { x: number, y: number },
    nexts: { [dir in Direction.asType]?: number };
};

export abstract class Station implements Exportable{
    static size: number = 64;
    private static id_max: number = 2147483647;
    private sprite: Phaser.GameObjects.Sprite;

    data: stationData;
    readonly nexts: { [dir in Direction.asType]?: Station };
    id: number;
    constructor(
        data: stationData | null,
        public x: number,
        public y: number,
        public z: number,
        readonly type: stationType,
        id: number | null
    ){
        this.data = data ?? {
            id: id ?? Util.getRandomInt(0, Station.id_max),
            type: this.type,
            position: {x, y},
            nexts: {}
        };

        const layer = SceneManager.layer('field');
        this.sprite = layer.add.sprite(0, 0, this.data.type).setDepth(0);
        this.sprite.setDisplaySize(Station.size, Station.size);
        this.nexts = {};
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
        delete this.nexts[dir];
        delete this.data.nexts[dir];
        delete other.nexts[Direction.opposite(dir)];
        delete other.data.nexts[Direction.opposite(dir)];
    }
    toJSON(): object{
        return this.data;
    }

    abstract routine(gameData: GameData): subroutine<void>;
}
