import { FileIO } from "../utils/fileIO";
import { Road } from "./road";
import { Station } from "./stations/station";
import { StationMinus } from "./stations/stationMinus";
import { StationPlus } from "./stations/stationPlus";

export class Field{
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

    create(){
        this._stations = [];
        this.importFromJson('jsonTest');
    }

    static size = 128;
    static at(x: number, y: number){
        return [x * Field.size, y * Field.size];
    }

    importFromJson(name : string){
        let json = FileIO.getJson(name);
        json.forEach(ele => {
            let stationType = ele.type;
            let station : Station;
            let x = ele.position.x;
            let y = ele.position.y;
            switch(stationType){
                case 'plus' : station = new StationPlus(x, y, 0, ele.id);
                    break;
                case 'minus' : station = new StationMinus(x, y, 0, ele.id);
                    break;
                default :  break;
            }
            this.add(station);
        });
        json.forEach(ele => {
            if(ele.nexts.up!=null){
                this.connectStationWithID(ele.nexts.up, ele.id);
            }
            if(ele.nexts.left!=null){
                this.connectStationWithID(ele.nexts.left, ele.id);
            }
        });
        
    }

    connectStationWithID(id1 : number, id2 : number){
        let station1 = this.getStationByID(id1);
        let station2 = this.getStationByID(id2);
        if(station1 != null && station2 != null){
            this.addUpDownStation(station1, station2);
            this.addLeftRightStation(station1, station2);
        }else{
            if(station1 == null)
                console.log("Non-existent ID : " + id1);
            if(station2 == null)
                console.log("Non-existent ID : " + id2);
        }
    }

    getStationByID(id : number) : Station{
        return this.stations.find(station => station.id == id);
    }

    addUpDownStation(up: Station, down: Station){
        if(up.x != down.x) return;
        up.setNext('DOWN', down);
        for(let i = up.y+1; i < down.y; i++){
            this._roads.push(new Road(up.x, i, 'tate'));
        }
    }
    
    addLeftRightStation(left : Station, right : Station){
        if(left.y != right.y) return;
        left.setNext('RIGHT', right);
        for(let i = left.x + 1; i < right.x; i++){
            this._roads.push(new Road(i, left.y, 'yoko'));
        }
    }
}
