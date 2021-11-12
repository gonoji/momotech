import { GameObjects } from "phaser";
import { Field } from "../gameData/field";
import { Player } from "../gameData/player";
import { Station, stationType } from "../gameData/stations/station";
import { StationPlus } from "../gameData/stations/stationPlus";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Util } from "../utils/util";
import { Scene } from "./scene";
import { TitleScene } from "./titleScene";

export class EditScene extends Scene{
    private field : Field;
    private player : Player;
    private editStation : Station = null;
    private editFlag : boolean = false;
    private editArea : GameObjects.Rectangle;
    private stationtype : stationType = 'plus';
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
        this.editArea=SceneManager.scene.add.rectangle(128,128,128,128,0xffff00,0.5).setVisible(false).setDepth(128);
        this.field.add(new StationPlus(1,1));
        //this.field.add(new StationPlus(3,1));
        this.field.add(new StationPlus(5,1));
        this.field.add(new StationPlus(3,3));
        this.field.add(new StationPlus(3,5));
        //this.field.connectStationWithID(this.field.stations[0].id,this.field.stations[1].id);
        this.player = new Player(0);
        this.player.create(this.field.stations[0]);
    }
    update(){
        KeyManager.update();
        if(KeyManager.down('CTRL')){
            this.editFlag = Util.xor(this.editFlag,true);
            this.editArea.setVisible(this.editFlag);
            this.editArea.setPosition(this.player.location.x * 128, this.player.location.y * 128);
        }
        if(this.editFlag){
            for(const key of Direction.asArray){
                if(KeyManager.down(key)){
                    switch(key){
                        case 'UP':this.editArea.setPosition(this.editArea.x, this.editArea.y - 128);break;
                        case 'DOWN':this.editArea.setPosition(this.editArea.x, this.editArea.y + 128);console.log("down");break;
                        case 'LEFT':this.editArea.setPosition(this.editArea.x - 128, this.editArea.y );break;
                        case 'RIGHT':this.editArea.setPosition(this.editArea.x + 128, this.editArea.y );break;
                    }
                }
            }
            if(KeyManager.down('Z')){
                const sta = this.field.getStationByPosition(this.editArea.x/128, this.editArea.y/128);
                if(sta == null){
                    const s : Station = new StationPlus(this.editArea.x/128, this.editArea.y/128);
                    this.field.add(s);
                    for(const key of Direction.asArray){
                        const nearSta = this.field.getNearestStation(s,key);
                        if(nearSta != null){
                            const nextSta = nearSta.nexts[Direction.opposite(key)];
                            if(nextSta != null && nextSta != s){
                                this.field.disconnectStationWithID(nextSta.id,nearSta.id);
                                console.log("a");
                                this.field.connectStationWithID(s.id, nearSta.id);
                                console.log("b");
                                this.field.connectStationWithID(s.id, nextSta.id);
                            }
                        }
                    }
                }
            }
            if(KeyManager.down('DELETE')){
                const sta = this.field.getStationByPosition(this.editArea.x/128, this.editArea.y/128);
                if(sta != null && sta != this.player.location){
                    this.field.removeStationByID(sta.id);
                }
            }
        }else{
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
        }
        if(KeyManager.pressed('PLUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*0.95);
        }
        if(KeyManager.down('S')&&KeyManager.pressed('SHIFT')){
            this.load.saveJSON(this.field.export());
        }
        if(KeyManager.down('ESC')){
            SceneManager.start(new TitleScene());
        }
    }
}
