import { EventMessage } from "../events/eventMessage";
import { subroutine } from "../events/routineManager";
import { Direction } from "../utils/direction";
import { Exportable } from "../utils/exportable";
import { FileIO } from "../utils/fileIO";
import { GameData } from "./gameData";
import { Road } from "./road";
import { SpiritRock } from "./spiritRock";
import { Station, stationData } from "./stations/station";
import { stationEstateData } from "./stations/stationEstate";
import { stations } from "./stations/stations";

export interface FieldBase{
    readonly stations: Station[];
    readonly spiritRocks: SpiritRock[];
    create(): void;
    update(): void;
    final(): void;
}
export interface FieldInGame extends FieldBase{
    routineTurnStart(data: GameData): subroutine<void>;
    putSpiritRock(location: Station): void;
    removeSpiritRock(spiritRock: SpiritRock): void;
}
export interface FieldInEdit extends FieldBase, Exportable{
    getStationByCoordinate(x: number, y: number): Station;
    getStationByPosition(x: number, y: number): Station;
    getNearestStation(current: Station, dir: Direction.asType): Station;
    connectStationWithID(id1: number, id2: number): void;
    disconnectStationWithID(id1: number, id2: number): void;
    removeStationByID(id: number): void;
}

export class Field implements FieldInGame, FieldInEdit{
    readonly stations: Station[] = [];
    readonly spiritRocks: SpiritRock[] = [];
    private readonly roads: Road[] = [];
    
    create(){
        this.importFromJson('stations');
    }
    update(){
        for(const station of this.stations) station.update();
    }
    final(){
        for(const station of this.stations) station.final();        
    }

    static size = 64;
    static at(x: number, y: number){
        return {x: x * Field.size, y: y * Field.size};
    }

    private importFromJson(name: string){
        const json = FileIO.getJson(name);
        json.forEach((e: stationData & stationEstateData) => {
            switch(e.type){
                case 'estate': 
                    this.stations.push(new stations[e.type](e)); 
                    break;
                default: this.stations.push(new stations[e.type](e));
            }
        });
        json.forEach((e: stationData) => {
            if(e.nexts.up != null){
                this.connectStationWithID(e.nexts.up, e.id);
            }
            if(e.nexts.left != null){
                this.connectStationWithID(e.nexts.left, e.id);
            }
        });
    }
    private getStationByID(id: number){
        return this.stations.find(station => station.id == id);
    }

    /*--- FieldInGame ---*/

    *routineTurnStart(data: GameData): subroutine<void>{
        yield* this.weatheringSpiritRocks();
        data.turnPlayer.focus();
    }
    private *weatheringSpiritRocks(){
        for(const spiritRock of this.spiritRocks){
            if(spiritRock.weather()){
                spiritRock.focus();
                this.removeSpiritRock(spiritRock);
                yield new EventMessage('要石が消えた');
                yield 'end';
            }
        }
    }
    putSpiritRock(location: Station){
        this.spiritRocks.push(new SpiritRock(location));
    }
    removeSpiritRock(spiritRock: SpiritRock){
        this.spiritRocks.splice(this.spiritRocks.indexOf(spiritRock));
        spiritRock.final();
    }

    /*--- FieldInEdit ---*/

    /**
     * @param x scene座標でのx
     * @param y scene座標でのy
     */
    getStationByCoordinate(x: number, y: number){
        return this.getStationByPosition( x / Station.size , y / Station.size);
    }
    /**
     * @param x size倍する前のx
     * @param y size倍する前のy
     */
    getStationByPosition(x: number, y: number){
        return this.stations.find(station => station.x == x && station.y == y);
    }
    
    // current から dir 方向を見て、最も近い駅があればそれを返す
    getNearestStation(current: Station, dir: Direction.asType){
        const nearest = {
            station: null as Station,
            dist: Number.MAX_SAFE_INTEGER
        };
        this.stations.forEach(s => {
            const looked = look(current, s);
            if(looked?.dir == dir && looked.dist < nearest.dist){
                nearest.station = s;
                nearest.dist = looked.dist;
            }
        });
        return nearest.station;

        // from から 4 方向を見て、to が見えたらその方向と距離を返す
        function look(from: Station, to: Station){
            const v = { x: to.x - from.x, y: to.y - from.y };
            if(v.y == 0){
                if(v.x > 0) return { dir: 'RIGHT', dist:  v.x };
                if(v.x < 0) return { dir: 'LEFT',  dist: -v.x };
            }
            if(v.x == 0){
                if(v.y > 0) return { dir: 'DOWN', dist:  v.y };
                if(v.y < 0) return { dir: 'UP',   dist: -v.y };
            }
            return null;
        }
    }

    connectStationWithID(id1: number, id2: number){
        const s1 = this.getStationByID(id1);
        const s2 = this.getStationByID(id2);
        this.addUpDownStation(s1, s2);
        this.addLeftRightStation(s1, s2);
    }
    disconnectStationWithID(id1: number, id2: number){
        const station1 = this.getStationByID(id1);
        const station2 = this.getStationByID(id2);
        if(station1 != null && station2 != null){
            this.removeUpDownStation(station1, station2);
            this.removeLeftRightStation(station1, station2);
        }else{
            if(station1 == null) console.log(`station #${id1} not found`);
            if(station2 == null) console.log(`station #${id2} not found`);
        }
    }
    removeStationByID(id: number){
        const station = this.getStationByID(id);
        if(!station) return;
        for(const key of Direction.asArray){
            if(station.nexts[key]){
                this.removeLeftRightStation(station.nexts[key], station);
                this.removeUpDownStation(station.nexts[key], station);
            }
        }
        station.final();
        this.stations.splice(this.stations.indexOf(station), 1);
    }

    private addUpDownStation(up: Station, down: Station){
        if(up == null || down == null) return;
        if(up.x != down.x) return;
        if(up.y > down.y) [up, down] = [down, up];

        up.setNext('DOWN', down);
        for(let i = up.y + 1; i < down.y; i++){
            this.roads.push(new Road(up.x, i, 'tate'));
        }
    }
    private addLeftRightStation(left: Station, right: Station){
        if(left == null || right == null) return;
        if(left.y != right.y) return;
        if(right.x < left.x) [left, right] = [right, left];

        left.setNext('RIGHT', right);
        for(let i = left.x + 1; i < right.x; i++){
            this.roads.push(new Road(i, left.y, 'yoko'));
        }
    }

    private removeUpDownStation(up: Station, down: Station){
        if(up == null || down == null) return;
        if(up.x != down.x) return;
        if(up.y > down.y) [up, down] = [down, up];

        up.removeNext('DOWN', down);
        for(let i = 0; i < this.roads.length; i++){
            const road = this.roads[i]; 
            if(road.x == down.x && road.y > up.y && road.y < down.y && road.roadType == 'tate'){
                road.final();
                this.roads.splice(i--, 1);
            }
        }
    }
    private removeLeftRightStation(left: Station, right: Station){
        if(left == null || right == null) return;
        if(left.y != right.y) return;
        if(right.x < left.x) [left, right] = [right, left];

        left.removeNext('RIGHT', right);
        for(let i = 0; i < this.roads.length; i++){
            const road = this.roads[i]; 
            if(road.y == right.y && road.x > left.x && road.x < right.x && road.roadType == 'yoko'){
                road.final();
                this.roads.splice(i--, 1);
            }
        }
    }
    toJSON(){
        return this.stations;
    }
}

