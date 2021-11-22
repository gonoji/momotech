import { GameObjects } from "phaser";
import { Game } from "../game";
import { Field, FieldInEdit } from "../gameData/field";
import { Player } from "../gameData/player";
import { Station } from "../gameData/stations/station";
import { stations } from "../gameData/stations/stations";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Util } from "../utils/util";
import { Layer, Scene } from "./scene";
import { StationEstate } from "../gameData/stations/stationEstate";
import { InteractiveWindow } from "../utils/window";

type editMode = 'editStation' | 'editRoad' | 'editStationData';

export class EditScene extends Scene{
    private field: FieldInEdit;
    private player: Player;
    private editStationNum: number = 0;
    private mode: editMode = 'editRoad';
    private editArea?: GameObjects.Sprite;
    public interactiveWindow? : InteractiveWindow;

    constructor(){
        super('edit');
        this.field = new Field();
        this.player = new Player(0);
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
        this.field.removeAllData();
        this.field.importFromJson('edit');
        this.player.create(this.field.stations[0]);
        this.player.focus();

        this.interactiveWindow = InteractiveWindow.side();
        this.interactiveWindow.setVisible(false);
    }
    update(){
        KeyManager.update();
        this[this.mode]();

        if(KeyManager.pressed('PLUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom * 1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom * 0.95);
        }
        if(KeyManager.down('S') && KeyManager.pressed('SHIFT')){
            this.load.saveJSON(this.field);
        }
        // 編集中に間違えてタイトルに戻ると悲しいので消してある
        // if(KeyManager.down('ESC')) SceneManager.start(new TitleScene());
    }

    editStation(){
        if(!this.editArea || !this.interactiveWindow) throw new Error('not initialized');

        // カーソルの移動
        for(const key of Direction.asArray){
            if(KeyManager.down(key)){
                switch(key){
                    case 'UP': this.editArea.setPosition(this.editArea.x, this.editArea.y - Field.size);break;
                    case 'DOWN': this.editArea.setPosition(this.editArea.x, this.editArea.y + Field.size);break;
                    case 'LEFT': this.editArea.setPosition(this.editArea.x - Field.size, this.editArea.y );break;
                    case 'RIGHT': this.editArea.setPosition(this.editArea.x + Field.size, this.editArea.y );break;
                }
                const sta = this.pointed(this.editArea);
                if(sta != null && sta.type == 'estate'){
                    this.mode = 'editStationData';
                    this.interactiveWindow.setData(this, sta as StationEstate);
                }else{
                    this.interactiveWindow.removeData();
                }
                return;
            }
        }

        // 駅の配置
        if(KeyManager.down('Z')){
            if(this.pointed(this.editArea) == null){
                const type = Util.keys(stations)[this.editStationNum];
                let placed: Station;
                if(type == 'estate'){
                    const s = new stations[type]({
                        id: Util.getRandomInt(0, 0x10000),
                        type,
                        position: { x: this.editArea.x / Field.size, y: this.editArea.y / Field.size },
                        name: '物件駅',
                        estates: []
                    });
                    this.mode = 'editStationData';
                    this.interactiveWindow.setData(this, s);
                    placed = s;
                }
                else if(type == 'shop'){
                    placed = new stations[type]({
                        id: Util.getRandomInt(0, 0x10000),
                        type,
                        position: { x: this.editArea.x / Field.size, y: this.editArea.y / Field.size },
                        cards: []
                    });
                }
                else{
                    placed = new stations[type]({
                        id: Util.getRandomInt(0, 0x10000),
                        type,
                        position: { x: this.editArea.x / Field.size, y: this.editArea.y / Field.size }
                    });
                }
                this.field.stations.push(placed);

                for(const key of Direction.asArray){
                    const nearSta = this.field.getNearestStation(placed, key);
                    if(nearSta != null){
                        const nextSta = nearSta.nexts[Direction.opposite(key)];
                        if(nextSta != null && nextSta != placed){
                            this.field.disconnectStationWithID(nextSta.id,nearSta.id);
                            this.field.connectStationWithID(placed.id, nearSta.id);
                            this.field.connectStationWithID(placed.id, nextSta.id);
                        }
                    }
                }
            }
        }
        
        // 配置する駅の変更
        else if(KeyManager.down('C')){
            this.editStationNum = (this.editStationNum + 1) % Object.keys(stations).length;
            this.editArea?.setTexture(Object.keys(stations)[this.editStationNum]);
        }

        // 駅の削除
        else if(KeyManager.down('X')){
            const sta = this.field.getStationByPosition(this.editArea.x / Field.size, this.editArea.y / Field.size);
            if(sta != null && sta != this.player.location){
                if(sta.type == 'estate'){
                    this.interactiveWindow.removeData();
                }
                this.field.removeStationByID(sta.id);
            }
        }

        // 道編集モードに切り替え
        else if(KeyManager.down('CTRL')){
            this.mode = 'editRoad';
            this.editArea.setVisible(false);
        }
    }
    editRoad(){
        if(!this.editArea || !this.interactiveWindow) throw new Error('not initialized');

        // カーソルの移動・道の配置
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

        // 駅編集モードに切り替え
        if(KeyManager.down('CTRL')){
            this.mode = 'editStation';
            this.editArea.setVisible(true);
            this.editArea.setPosition(this.player.location.x * Field.size, this.player.location.y * Field.size);
            this.interactiveWindow.removeData();
            const sta = this.pointed(this.editArea);
            if(sta?.type == 'estate'){
                this.mode = 'editStationData';
                this.interactiveWindow.setData(this, sta as StationEstate);
            }
        }

    }
    editStationData(){
        if(KeyManager.down('ESC')){
            this.mode = 'editStation';
            this.interactiveWindow?.removeData();
        }
    }

    private pointed(pos: { x: number, y: number }){
        return this.field.getStationByPosition(pos.x / Field.size, pos.y / Field.size);
    }
}
