import { subroutine } from "../../routines/routine";
import { Direction } from "../../utils/direction";
import { Exportable } from "../../utils/exportable";
import { SceneManager } from "../../utils/sceneManager";
import { Util } from "../../utils/util";
import { Field, FieldInGame } from "../field";
import { GameData } from "../gameData";

export type stationType = 'plus' | 'minus' | 'card' | 'estate' | 'shop';
export type stationBaseData = {
    id: number,
    type: stationType,
    position: { x: number, y: number },
}
export type roadData = {
    nexts: { [dir in Direction.asType]?: number };
};

export abstract class Station implements Exportable{
    static size: number = 64;
    // private static id_max: number = 2147483647;

    readonly type: stationType;
    readonly id: number;
    x: number;
    y: number;
    z: number;
    readonly nexts: { [dir in Direction.asType]?: Station };

    private sprite: Phaser.GameObjects.Sprite;

    constructor(data: stationBaseData){
        this.type = data.type;
        this.id = data.id;
        this.x = data.position.x;
        this.y = data.position.y;
        this.z = 0;
        this.nexts = {};

        const layer = SceneManager.layer('field');
        this.sprite = layer.add.sprite(0, 0, this.type).setDepth(0);
        this.sprite.setDisplaySize(Station.size, Station.size);

        const pos = Field.at(this.x, this.y);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
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
        other.nexts[Direction.opposite(dir)] = this;
    }
    removeNext(dir: Direction.asType, other: Station){
        delete this.nexts[dir];
        delete other.nexts[Direction.opposite(dir)];
    }
    toJSON(): stationBaseData & roadData{
        return {
            id: this.id,
            type: this.type,
            position: { x: this.x, y: this.y },
            nexts: Util.mapObject(this.nexts, (_, station) => station?.id)
        };
    }

    abstract routine(gameData: GameData): subroutine<void>;
}
