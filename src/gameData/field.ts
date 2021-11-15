import { Direction } from "../utils/direction";
import { Exportable } from "../utils/exportable";
import { FileIO } from "../utils/fileIO";
import { estateData } from "./estates/estate";
import { Road } from "./road";
import { Station, stationData } from "./stations/station";
import { StationEstate, stationEstateData } from "./stations/stationEstate";
import { stations } from "./stations/stations";

export class Field implements Exportable{
    private _stations: Station[];
    private _roads: Road[];
    constructor(){
        this._stations = [];
        this._roads = [];
    }
    update(){
        for(const station of this.stations) station.update();
    }
    add(s: Station){
        this._stations.push(s);
        return this;
    }
    get stations(){
        return this._stations;
    }
    final(){
        for(const station of this.stations) station.final();        
    }

    create(name : string = 'stations'){
        this._stations = [];
        this.importFromJson(name);
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
                    this.add(new stations[e.type](e)); 
                    break;
                default: this.add(new stations[e.type](e));
            }
        });
        json.forEach((e: any) => {
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

    disconnectStationWithID(id1 : number, id2 : number){
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

    private getStationByID(id : number) : Station{
        return this.stations.find(station => station.id == id);
    }
    removeStationByID(id : number){
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
    getStationByCoordinate(x : number, y : number) : Station{
        return this.getStationByPosition( x / Station.size , y / Station.size);
    }
    /**
     * @param x size倍する前のx
     * @param y size倍する前のy
     * @returns 
     */
    getStationByPosition(x : number, y : number) : Station{
        return this.stations.find(station => station.x == x && station.y == y);
    }
    
    getNearestStation(currentStation : Station, dir : Direction.asType): Station{
        let nearest : Station = null;
        let index = Number.MAX_SAFE_INTEGER;
        let dis : number = 0;
        this._stations.forEach(sta => {
            switch(dir){
                case 'UP' : 
                    dis = currentStation.y - sta.y;
                    if(sta.x == currentStation.x && dis > 0){
                    if(dis < index){
                        nearest = sta;
                        index = dis;
                    }
                }break;
                case 'DOWN' : 
                    dis = - currentStation.y + sta.y;
                    if(sta.x == currentStation.x && dis > 0){
                    if(dis < index){
                        nearest = sta;
                        index = dis;
                    }
                }break;
                case 'RIGHT' : 
                    dis = - currentStation.x + sta.x;
                    if(sta.y == currentStation.y && dis > 0){
                    if(dis < index){
                        nearest = sta;
                        index = dis;
                    }
                }break;
                case 'LEFT' : 
                    dis = currentStation.x - sta.x;
                    if(sta.y == currentStation.y && dis > 0){
                    if(dis < index){
                        nearest = sta;
                        index = dis;
                    }
                }break;
            }
        });
        return nearest;
    }
    private addUpDownStation(up: Station, down: Station){
        if(up == null || down == null) return ;
        if(up.x != down.x) return;
        if(up.y > down.y){
            const sta = up;
            up = down;
            down = sta;
        }
        up.setNext('DOWN', down);
        for(let i = up.y+1; i < down.y; i++){
            this._roads.push(new Road(up.x, i, 'tate'));
        }
    }
    private addLeftRightStation(left: Station, right: Station){
        if(left == null || right == null) return ;
        if(left.y != right.y) return;
        if(right.x < left.x){
            const sta = left;
            left = right;
            right = sta;
        }
        left.setNext('RIGHT', right);
        for(let i = left.x + 1; i < right.x; i++){
            this._roads.push(new Road(i, left.y, 'yoko'));
        }
    }
    removeUpDownStation(up: Station, down: Station){
        if(up == null || down == null)return ;
        if(up.x != down.x) return;
        if(up.y > down.y){
            const sta = up;
            up = down;
            down = sta;
        }
        up.removeNext('DOWN', down);
        for(let i = 0;  i < this._roads.length; i++){
            let road : Road = this._roads[i]; 
            if(road.x == down.x && road.y > up.y && road.y < down.y && road.roadType == 'tate'){
                road.final();
                this._roads.splice(i, 1);
                i--;
            }
        }
    }
    
    removeLeftRightStation(left : Station, right : Station){
        if(left == null || right == null)return ;
        if(left.y != right.y) return;
        if(right.x < left.x){
            const sta = left;
            left = right;
            right = sta;
        }
        left.removeNext('RIGHT', right);
        for(let i = 0;  i < this._roads.length; i++){
            let road : Road = this._roads[i]; 
            if(road.y == right.y && road.x > left.x && road.x < right.x && road.roadType == 'yoko'){
                road.final();
                this._roads.splice(i, 1);
                i--;
            }
        }
    }
    toJSON(){
        return this._stations;
    }
}

