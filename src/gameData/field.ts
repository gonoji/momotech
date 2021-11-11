import { Exportable } from "../utils/exportable";
import { FileIO } from "../utils/fileIO";
import { SceneManager } from "../utils/sceneManager";
import { Road } from "./road";
import { Station } from "./stations/station";
import { StationMinus } from "./stations/stationMinus";
import { StationPlus } from "./stations/stationPlus";

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

    create(){
        this._stations = [];
        this.importFromJson('stations');
    }

    static size = 128;
    static at(x: number, y: number){
        return [x * Field.size, y * Field.size];
    }

    private importFromJson(name: string){
        const json = FileIO.getJson(name);
        json.forEach((e: any) => {
            const x = e.position.x;
            const y = e.position.y;
            switch(e.type){
                case 'plus': this.add(new StationPlus(x, y, 0, e.id)); break;
                case 'minus': this.add(new StationMinus(x, y, 0, e.id)); break;
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
    private connectStationWithID(id1: number, id2: number){
        const s1 = this.getStationByID(id1);
        const s2 = this.getStationByID(id2);
        this.addUpDownStation(s1, s2);
        this.addLeftRightStation(s1, s2);
    }
    private getStationByID(id : number) : Station{
        return this.stations.find(station => station.id == id);
    }
    private addUpDownStation(up: Station, down: Station){
        if(up.x != down.x) return;
        up.setNext('DOWN', down);
        for(let i = up.y+1; i < down.y; i++){
            this._roads.push(new Road(up.x, i, 'tate'));
        }
    }
    private addLeftRightStation(left: Station, right: Station){
        if(left.y != right.y) return;
        left.setNext('RIGHT', right);
        for(let i = left.x + 1; i < right.x; i++){
            this._roads.push(new Road(i, left.y, 'yoko'));
        }
    }
    export(){
        const jsonStr = '[' + this._stations.map(e => JSON.stringify(e.export())).join(',') + ']';
        return JSON.parse(jsonStr);
    }
}
