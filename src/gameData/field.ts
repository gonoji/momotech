import { EventMessage } from "../events/eventMessage";
import { subroutine } from "../routines/routine";
import { Direction } from "../utils/direction";
import { Exportable } from "../utils/exportable";
import { FileIO } from "../utils/fileIO";
import { Util } from "../utils/util";
import { Destination } from "./destination";
import { GameData } from "./gameData";
import { Road } from "./road";
import { SpiritRock } from "./spiritRock";
import { roadData, Station } from "./stations/station";
import { StationEstate, stationEstateData } from "./stations/stationEstate";
import { stationData, stations } from "./stations/stations";
import { stationShopData } from "./stations/stationShop";

export interface FieldBase{
    readonly stations: Station[];
    readonly spiritRocks: SpiritRock[];
    importFromJson(name: string): void;
    update(): void;
    final(): void;
    getStationByID(id: number): Station;
}
export interface FieldInGame extends FieldBase{
    routineMonthStart(data: GameData): subroutine<void>;
    destination?: Destination;
    setDestination(station: StationEstate): void;
    accessibleStations(start: Station, steps: number, from?: Direction.asType): Station[];
    putSpiritRock(location: Station): void;
    removeSpiritRock(spiritRock: SpiritRock): void;
}
export interface FieldInEdit extends FieldBase, Exportable{
    getStationByPosition(x: number, y: number): Station | null;
    getNearestStation(current: Station, dir: Direction.asType): Station | null;
    connectStationWithID(id1: number, id2: number): void;
    disconnectStationWithID(id1: number, id2: number): void;
    removeStationByID(id: number): void;
    removeAllData(): void;
}

export class Field implements FieldInGame, FieldInEdit{
    readonly stations: Station[] = [];
    readonly spiritRocks: SpiritRock[] = [];
    private _destination?: Destination;
    private readonly roads: Road[] = [];
    
    update(){
        for(const station of this.stations) station.update();
        this.destination?.update();
    }
    final(){
        for(const station of this.stations) station.final();
        for(const rock of this.spiritRocks) rock.final();
        for(const road of this.roads) road.final();
        this.destination?.final();
    }

    static size = 64;
    static at(x: number, y: number): { x: number, y: number };
    static at(pos: { x: number, y: number }): { x: number, y: number };
    static at(arg1: number | { x: number, y: number }, arg2?: number){
        if(typeof arg1 != 'number'){
            [arg1, arg2] = [arg1.x, arg1.y];
        }
        return {x: arg1 * Field.size, y: arg2! * Field.size};
    }

    importFromJson(name: string): void{
        const json = FileIO.getJson(name);

        json.forEach((e: stationData) => {
            switch(e.type){
            case 'estate':
                this.stations.push(new stations[e.type](e as stationEstateData));
                break;
            case 'shop':
                this.stations.push(new stations[e.type](e as stationShopData));
                break;
            default:
                this.stations.push(new stations[e.type](e));
            }
        });
        json.forEach((e: stationData & roadData) => {
            if(e.nexts.UP != null){
                this.connectStationWithID(e.nexts.UP, e.id);
            }
            if(e.nexts.LEFT != null){
                this.connectStationWithID(e.nexts.LEFT, e.id);
            }
        });
    }
    getStationByID(id: number){
        const station = this.stations.find(station => station.id == id);
        if(station) return station;
        throw new Error(`not found`);
    }

    /*--- FieldInGame ---*/

    *routineMonthStart(data: GameData): subroutine<void>{
        yield* this.weatheringSpiritRocks();
        data.turnPlayer.focus();
    }
    private *weatheringSpiritRocks(){
        for(const spiritRock of this.spiritRocks){
            if(spiritRock.weather()){
                spiritRock.focus();
                this.removeSpiritRock(spiritRock);
                yield new EventMessage('??????????????????');
                yield 'end';
            }
        }
    }

    get destination(){
        return this._destination;
    }
    setDestination(station: StationEstate){
        this._destination?.final();
        this._destination = new Destination(station);
    }

    accessibleStations(start: Station, steps: number, from?: Direction.asType){
        type typeFrom = Direction.asType | 'CENTER';
        let possibleDest: {[id: number]: typeFrom} = {};
        possibleDest[start.id] = from ?? 'CENTER';

        for(let i = 1; i <= steps; i++){
            const nextPossibleDest: {[id: number]: typeFrom} = {};
            for(const id of Util.keys(possibleDest)){
                const station = this.getStationByID(id);
                for(const dir of Direction.asArray){
                    if(!station.passable(dir, this) || dir == possibleDest[id]) continue;
                    const destID = station.nexts[dir]?.id;
                    if(destID){
                        if(nextPossibleDest[destID] != undefined){
                            nextPossibleDest[destID] = 'CENTER';
                        }
                        else{
                            nextPossibleDest[destID] = Direction.opposite(dir);    
                        }
                    }
                }               
            }
            possibleDest = nextPossibleDest;
        }
        return Util.keys(possibleDest).map(id => this.getStationByID(id));
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
     * @param x size???????????????x
     * @param y size???????????????y
     */
    getStationByPosition(x: number, y: number){
        return this.stations.find(station => station.x == x && station.y == y) ?? null;
    }
    
    // current ?????? dir ????????????????????????????????????????????????????????????
    getNearestStation(current: Station, dir: Direction.asType){
        const nearest = {
            station: null as Station | null,
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

        // from ?????? 4 ??????????????????to ?????????????????????????????????????????????
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
        if(s1 && s2){
            this.addUpDownStation(s1, s2);
            this.addLeftRightStation(s1, s2);
        }
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
            const next = station.nexts[key];
            if(next){
                this.removeLeftRightStation(next, station);
                this.removeUpDownStation(next, station);
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

    removeAllData(){
        this.final();
        this.stations.splice(0);
        this.roads.splice(0);
    }

    toJSON(){
        return this.stations;
    }
}

