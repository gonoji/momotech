import { GameObjects } from "phaser";
import { Game } from "../game";
import { Field } from "../gameData/field";
import { Player } from "../gameData/player";
import { Station, stationType } from "../gameData/stations/station";
import { StationPlus } from "../gameData/stations/stationPlus";
import { stations } from "../gameData/stations/stations";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Util } from "../utils/util";
import { Layer, Scene } from "./scene";
import { TitleScene } from "./titleScene";
import { StationEstate } from "../gameData/stations/stationEstate";
import { InteractiveWindow } from "../utils/window";

export class EditScene extends Scene{
    private field: Field;
    private player: Player;
    private editStationNum: number = 0;
    private editFlag: boolean = false;
    private editArea: GameObjects.Sprite;
    public interactiveWindow : InteractiveWindow;
    estateEditFlag: boolean = false;


    constructor(){
        super(`edit`);
    }
    preload(){
        this.field = new Field();
    }
    init(){
        super.init();
        SceneManager.add(new Layer('field'));
        const height = Game.height;
        const width = Math.floor(height * 4/3);
        SceneManager.add(new Layer('dialog', { x: 0, y: 0, w: width, h: height }));
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');

        const layer = SceneManager.layer('field');
        this.editArea = layer.add.sprite(Field.size, Field.size, Object.keys(stations)[this.editStationNum])
            .setAlpha(0.5)
            .setDisplaySize(Field.size, Field.size)
            .setVisible(false)
            .setDepth(100);
        this.field.create('edit');
        this.player = new Player(0);
        this.player.create(this.field.stations[0]);
        this.player.focus();

        this.interactiveWindow = InteractiveWindow.side();
        this.interactiveWindow.setVisible(false);
        
        
    }
    update(){
        KeyManager.update();
        if(this.estateEditFlag){
            if(KeyManager.down('ESC')){
                this.estateEditFlag = false;
                this.interactiveWindow.removeData();
            }
            return;
        }
        if(KeyManager.down('CTRL')){
            this.editFlag = Util.xor(this.editFlag, true);
            this.editArea.setVisible(this.editFlag);
            this.editArea.setPosition(this.player.location.x * Field.size, this.player.location.y * Field.size);
            this.interactiveWindow.removeData();
            const sta = this.field.getStationByPosition(this.editArea.x / Field.size, this.editArea.y / Field.size);    
            if(sta != null && sta.stationType == 'estate'){
                const esta = sta as StationEstate;
                this.interactiveWindow.setData(this, esta);
            }
        }
        if(this.editFlag){
            for(const key of Direction.asArray){
                if(KeyManager.down(key)){
                    switch(key){
                        case 'UP': this.editArea.setPosition(this.editArea.x, this.editArea.y - Field.size);break;
                        case 'DOWN': this.editArea.setPosition(this.editArea.x, this.editArea.y + Field.size);break;
                        case 'LEFT': this.editArea.setPosition(this.editArea.x - Field.size, this.editArea.y );break;
                        case 'RIGHT': this.editArea.setPosition(this.editArea.x + Field.size, this.editArea.y );break;
                    }
                    
                    const sta = this.field.getStationByPosition(this.editArea.x / Field.size, this.editArea.y / Field.size);
                    if(sta != null && sta.stationType == 'estate'){
                        this.interactiveWindow.setData(this, sta as StationEstate);
                    }else{
                        this.interactiveWindow.removeData();
                    }
                }
            }
            if(KeyManager.down('Z')){
                const sta = this.field.getStationByPosition(this.editArea.x / Field.size, this.editArea.y / Field.size);
                if(sta == null){
                    const s: Station = new stations[Object.keys(stations)[this.editStationNum]](null, this.editArea.x /Field.size, this.editArea.y / Field.size);
                    this.field.add(s);
                    if(s.stationType == 'estate'){
                        this.interactiveWindow.setData(this, s as StationEstate);
                    }
                    for(const key of Direction.asArray){
                        const nearSta = this.field.getNearestStation(s,key);
                        if(nearSta != null){
                            const nextSta = nearSta.nexts[Direction.opposite(key)];
                            if(nextSta != null && nextSta != s){
                                this.field.disconnectStationWithID(nextSta.id,nearSta.id);
                                this.field.connectStationWithID(s.id, nearSta.id);
                                this.field.connectStationWithID(s.id, nextSta.id);
                            }
                        }
                    }
                }
            }else if(KeyManager.down('C')){
                this.editStationNum = (this.editStationNum + 1) % Object.keys(stations).length;
                this.editArea.setTexture(Object.keys(stations)[this.editStationNum]);
            }
            else if(KeyManager.down('X')){
                const sta = this.field.getStationByPosition(this.editArea.x / Field.size, this.editArea.y / Field.size);
                if(sta != null && sta != this.player.location){
                    if(sta.stationType == 'estate'){
                        this.interactiveWindow.removeData();
                    }
                    this.field.removeStationByID(sta.id);
                }
            }
        }else{
            for(const key of Direction.asArray){
                if(KeyManager.down(key)){
                    if(KeyManager.pressed('SHIFT')){
                        const sta = this.field.getNearestStation(this.player.location, key);
                        if(sta != null){
                            console.log(sta.id+" " +this.player.location.id);
                            if(sta.nexts[Direction.opposite(key)] == null){
                                this.field.connectStationWithID(this.player.location.id, sta.id);
                            }else if(sta.nexts[Direction.opposite(key)] == this.player.location){
                                this.field.disconnectStationWithID(this.player.location.id, sta.id);
                            }
                        }
                    }else{
                        this.player.moveTo(key);
                    }
                }
            }
        }
        if(KeyManager.pressed('PLUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom * 1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom * 0.95);
        }
        if(KeyManager.down('S') && KeyManager.pressed('SHIFT')){
            this.load.saveJSON(this.field);
        }
        if(KeyManager.down('ESC')){
            SceneManager.start(new TitleScene());
        }
    }
}
