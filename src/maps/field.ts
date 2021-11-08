import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { Station } from "./stations/station";
import { StationMinus } from "./stations/stationMinus";
import { StationPlus } from "./stations/stationPlus";

export class Field{
    private _stations: Station[];
    // private loads: GameObjects.Group;
    constructor(){
        this._stations = [];
        // this.loads = SceneManager.getCurrentScene().add.group();
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

    static generate(){
        const stations = [
            new StationPlus (1, 1),
            new StationPlus (3, 1),
            new StationMinus(5, 1),
            new StationPlus (1, 3),
            new StationMinus(3, 3),
            new StationPlus (5, 3),
        ];
        stations[0].addRightStation(stations[1]);
        stations[1].addRightStation(stations[2]);
        stations[3].addRightStation(stations[4]);
        stations[4].addRightStation(stations[5]);
        stations[0].addDownStation(stations[3]);
        stations[1].addDownStation(stations[4]);
        stations[2].addDownStation(stations[5]);

        const field = new Field();
        for(const station of stations) field.add(station);
        return field;
    }
}
