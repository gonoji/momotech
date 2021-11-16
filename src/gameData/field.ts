import { subroutine } from "../events/routineManager";
import { Direction } from "../utils/direction";
import { Exportable } from "../utils/exportable";
import { FileIO } from "../utils/fileIO";
import { GameData } from "./gameData";
import { Road } from "./road";
import { Station, stationData } from "./stations/station";
import { stationEstateData } from "./stations/stationEstate";
import { stations } from "./stations/stations";

export class Field implements Exportable{
    private _stations: Station[] = [];
    private roads: Road[] = [];

    create(name: string = 'stations'){
        this._stations = [];
        this.importFromJson(name);
    }
    update(){
        for(const station of this.stations) station.update();
    }
    final(){
        for(const station of this.stations) station.final();        
    }

    }

    static size = 64;
    static at(x: number, y: number){
        return {x: x * Field.size, y: y * Field.size};
    }
    get stations(){
        return this._stations;
    }

    add(s: Station){
        this._stations.push(s);
        return this;
    }

    private importFromJson(name: string){
        const json = FileIO.getJson(name);
        json.forEach((e: stationData & stationEstateData) => {
            switch(e.type){
                case 'estate': 
                    this.add(new stations[e.type](e)); 
                    break;
                default: this.add(new stations[e.type](e));
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
            if(station1 == null)
                console.log("Non-existent ID : " + id1);
            if(station2 == null)
                console.log("Non-existent ID : " + id2);
        }
    }

    private getStationByID(id: number){
        return this.stations.find(station => station.id == id);
    }
    removeStationByID(id: number){
        for(let i = 0;  i < this._stations.length; i++){
            const sta : Station = this._stations[i]; 
            if(sta.id == id){  
                for(const key of Direction.asArray){
                    if(sta.nexts[key] != null){
                        if(sta.nexts[key] != null){
                            this.removeLeftRightStation(sta.nexts[key], sta);
                            this.removeUpDownStation(sta.nexts[key], sta);
                        }
                    }
                }
                sta.final();
                this._stations.splice(i, 1);
                return ;
            }
        }

    }
    /**
     * @param x scene座標でのx
     * @param y scene座標でのy
     * @returns 
     */
    getStationByCoordinate(x: number, y: number){
        return this.getStationByPosition( x / Station.size , y / Station.size);
    }
    /**
     * @param x size倍する前のx
     * @param y size倍する前のy
     * @returns 
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
            const look = this.look(current, s);
            if(look?.dir == dir && look.dist < nearest.dist){
                nearest.station = s;
                nearest.dist = look.dist;
            }
        });
        return nearest.station;
    }
    // from から 4 方向を見て、to が見えたらその方向と距離を返す
    private look(from: Station, to: Station){
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

    removeUpDownStation(up: Station, down: Station){
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
    removeLeftRightStation(left: Station, right: Station){
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
        return this._stations;
    }
}

