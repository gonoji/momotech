import { EventManager } from "../events/eventManager";
import { routineTurn } from "../events/routineTurn";
import { Field } from "../gameData/field";
import { GameData } from "../gameData/gameData";
import { Player } from "../gameData/player";
import { Station } from "../gameData/stations/station";
import { StationPlus } from "../gameData/stations/stationPlus";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Scene } from "./scene";
import { TitleScene } from "./titleScene";

export class EditScene extends Scene{
    private field : Field;
    private player : Player;
    private editStation : Station = null;
    constructor(){
        super(`EditScene`);
    }
    init(){
        SceneManager.init(this);
    }
    preload(){
        this.field = new Field();
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.field.add(new StationPlus(1,1));
        this.field.add(new StationPlus(3,1));
        this.field.add(new StationPlus(5,1));
        //this.field.connectStationWithID(this.field.stations[0].id,this.field.stations[1].id);
        this.player = new Player(0);
        this.player.create(this.field.stations[0]);
    }
    update(){
        KeyManager.update();
        for(const key of Direction.asArray){
            if(KeyManager.down(key)){
                if(KeyManager.pressed('SHIFT')){
                    const sta = this.field.getNearestStation(this.player.location,key);
                    if(sta != null){
                        console.log(sta.id+" " +this.player.location.id);
                        if(sta.nexts[Direction.opposite(key)] == null){
                            this.field.connectStationWithID(this.player.location.id,sta.id);
                        }else if(sta.nexts[Direction.opposite(key)] == this.player.location){
                            this.field.disconnectStationWithID(this.player.location.id,sta.id);
                        }else{

                        }
                    }
                }else{
                    this.player.moveTo(key);
                }
            }
        }
        if(KeyManager.pressed('PLUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*0.95);
        }
        if(KeyManager.down('S')&&KeyManager.pressed('SHIFT')){
            this.field.exportStations();
        }
        if(KeyManager.down('ESC')){
            SceneManager.start(new TitleScene());
        }
    }
}

