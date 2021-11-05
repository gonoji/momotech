import { SceneManager } from "../utils/sceneManager";
import { Station } from "./station";

export class Field{
    private stations : Station[];
    constructor(){
        this.stations=[];
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
}