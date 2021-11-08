import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { Station } from "./stations/station";

export class Field{
    private stations: Station[];
    private loads: GameObjects.Group;
    constructor(){
        this.stations = [];
        this.loads = SceneManager.getCurrentScene().add.group();
        console.log('length: ' + this.loads.getLength());
    }
    update(){
        for(const station of this.stations) station.update();
    }
    addStation(s: Station){
        this.stations.push(s);
    }
    getStations(){
        return this.stations;
    }
    
    final(){
        
    }
}