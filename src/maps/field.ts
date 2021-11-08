import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { Station } from "./station";

export class Field{
    private stations : Station[];
    private loads:GameObjects.Group;
    constructor(){
        this.stations=[];
        this.loads=SceneManager.getCurrentScene().add.group();
        console.log('length : '+this.loads.getLength());
    }
    update(){
        for(let station of this.stations){
            station.update();
        }
    }
    addStation(s:Station){
        this.stations.push(s);
    }
    getStations():Station[]{
        return this.stations;
    }
    
    final(){
        
    }
}