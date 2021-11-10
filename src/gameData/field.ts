
import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { Road } from "./road";
import { Station } from "./stations/station";
import { StationMinus } from "./stations/stationMinus";
import { StationPlus } from "./stations/stationPlus";

export class Field{
    private _stations: Station[];
    private _roads: Road[];
    constructor(){
        this._stations = [];
        this._roads=[];
        //this.roads = SceneManager.getCurrentScene().add.group();
        // console.log('length: ' + this.loads.getLength());
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
        // this.loads = SceneManager.getCurrentScene().add.group();
        // console.log('length: ' + this.loads.getLength());

        const stations = [
            new StationPlus (1, 1),
            new StationPlus (3, 1),
            new StationMinus(5, 1),
            new StationPlus (1, 3),
            new StationMinus(3, 3),
            new StationPlus (7, 3),
            new StationPlus (7, 1),
            new StationPlus (9, 1),
            new StationPlus (9, 5),
            new StationPlus (7, 5),
            new StationPlus (3, 5),
        ];
        const field = new Field();
        
        field.addLeftRightStation(stations[0], stations[1]);
        field.addLeftRightStation(stations[1], stations[2]);
        field.addLeftRightStation(stations[3], stations[4]);
        field.addLeftRightStation(stations[4], stations[5]);
        field.addLeftRightStation(stations[2], stations[6]);
        field.addLeftRightStation(stations[6], stations[7]);
        field.addLeftRightStation(stations[9], stations[8]);
        field.addLeftRightStation(stations[10], stations[9]);
        
        field.addUpDownStation(stations[0], stations[3]);
        field.addUpDownStation(stations[1], stations[4]);
        field.addUpDownStation(stations[2], stations[5]);
        field.addUpDownStation(stations[6], stations[5]);
        field.addUpDownStation(stations[7], stations[8]);
        field.addUpDownStation(stations[5], stations[9]);
        field.addUpDownStation(stations[4], stations[10]);


        for(const station of stations) field.add(station);
        return field;

    }

    static size = 100;
    static at(x: number, y: number){
        return [x * Field.size, y * Field.size];
    }

    addUpDownStation(up: Station, down: Station){
        if(up.x != down.x) return;
        up.addDownStation(down);
        for(let i = up.y+1; i < down.y;i++){
            this._roads.push(new Road(up.x, i, 'tate'));
        }
    }
    
    addLeftRightStation(left: Station, right: Station){
        if(left.y != right.y) return;
        left.addRightStation(right);
        for(let i = left.x+1; i < right.x; i++){
            this._roads.push(new Road(i, left.y, 'yoko'));
        }
    }
}
