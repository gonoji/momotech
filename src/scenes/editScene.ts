import { GameObjects } from "phaser";
import { Game } from "../game";
import { Field, FieldInEdit } from "../gameData/field";
import { Player } from "../gameData/player";
import { Station, stationBaseData, stationType } from "../gameData/stations/station";
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
    private _cursor = { x: 0, y: 0 };
    private editArea?: GameObjects.Sprite;
    public interactiveWindow?: InteractiveWindow;

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
    private editStation(){
        // カーソルの移動
        for(const key of Direction.asArray){
            if(KeyManager.down(key)){
                const delta = Direction.unitVector(key);
                this.cursor = { x: this.cursor.x + delta.x, y: this.cursor.y + delta.y };
                return;
            }
        }

        // 駅の配置
        if(KeyManager.down('Z')){
            if(this.pointed(this.cursor)) return;

            const type = Util.keys(stations)[this.editStationNum];
            const station = EditScene.defaultStation(type, this.cursor);
            this.field.stations.push(station);
            
            for(const dir of Direction.asArray){
                const front = this.field.getNearestStation(station, dir);
                if(front != null){
                    const back = front.nexts[Direction.opposite(dir)];
                    if(back != null && back != station){
                        this.field.disconnectStationWithID(front.id, back.id);
                        this.field.connectStationWithID(station.id, front.id);
                        this.field.connectStationWithID(station.id, back.id);
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
            const sta = this.pointed(this.cursor);
            if(sta != null && sta != this.player.location){
                this.field.removeStationByID(sta.id);
            }
        }

        // 道編集モードに切り替え
        else if(KeyManager.down('CTRL')) this.changeToEditRoad();

        // 駅データ編集モードに切り替え
        else if(KeyManager.down('ENTER')){
            const pointed = this.pointed(this.cursor);
            if(pointed?.type == 'estate'){
                this.changeToEditStationData(pointed as StationEstate);
            }
        }
    }
    private editRoad(){
        // カーソルの移動・道の配置
        for(const key of Direction.asArray){
            if(KeyManager.down(key)){
                if(KeyManager.pressed('SHIFT')){
                    const next = this.field.getNearestStation(this.player.location, key);
                    if(next != null){
                        // console.log(sta.id, this.player.location.id);
                        if(next.nexts[Direction.opposite(key)] == null){
                            this.field.connectStationWithID(this.player.location.id, next.id);
                        }
                        else{
                            this.field.disconnectStationWithID(this.player.location.id, next.id);
                        }
                    }
                }
                else this.player.moveTo(key);
            }
        }

        // 駅編集モードに切り替え
        if(KeyManager.down('CTRL')){
            this.cursor = this.player.location;
            this.changeToEditStation();
        }

    }
    private editStationData(){
        if(KeyManager.down('ESC')) this.changeToEditStation();
    }

    private changeToEditRoad(){
        this.mode = 'editRoad';
        this.editArea?.setVisible(false);
        this.interactiveWindow?.removeData();
    }
    private changeToEditStation(){
        this.mode = 'editStation';
        this.editArea?.setVisible(true);
        this.interactiveWindow?.removeData();
    }
    private changeToEditStationData(station: StationEstate){
        this.mode = 'editStationData';
        this.interactiveWindow?.setData(this, station);
    }


    get cursor(){
        return this._cursor;
    }
    set cursor(c: { x: number, y: number }){
        this._cursor = c;
        const pos = Field.at(c);
        this.editArea?.setPosition(pos.x, pos.y);
    }

    private pointed(pos: { x: number, y: number }){
        return this.field.getStationByPosition(pos.x, pos.y);
    }

    private static defaultStation(type: stationType, position: { x: number, y: number }){
        const base = {id: Util.getRandomInt(0, 0xffffff), type, position};
        switch(type){
        case 'estate':
            return new stations[type]({ ...base, name: '物件駅', estates: [] });
        case 'shop':
            return new stations[type]({ ...base, cards: [] });
        default:
            return new stations[type](base);
        }
    }
}
