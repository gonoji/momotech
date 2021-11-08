import { Field } from "../maps/field";
import { Station } from "../maps/station";
import { StationPlus } from "../maps/stations/stationPlus";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";
import { Event } from "../events/event"
import { StationMinus } from "../maps/stations/stationMinus";

export class StationTestScene extends Phaser.Scene {
    constructor(){
        super({ key: 'StationTestScene' });
    }
    field :Field;
    init(){
        
        SceneManager.init(this);
        /*
        KeyManager.replaceKey('UP','W');
        KeyManager.replaceKey('DOWN','S');
        KeyManager.replaceKey('RIGHT','D');
        KeyManager.replaceKey('LEFT','A');*/
        this.field = new Field();
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        this.load.baseURL='static/';
        
	    this.load.image('plus', 'images/masu_plus_128.png');
	    this.load.image('minus', 'images/masu_minus_128.png');
        console.log('Hello Phaser');
    }
    private startText?: Phaser.GameObjects.Text; // 追加
    private ellipse?: Phaser.GameObjects.Ellipse; // 追加
    private bk_color: string = '0xeeeeee'; // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' }; // 追加

    private static num: integer = 0;
    create(){
        
        this.cameras.main.setBackgroundColor(this.bk_color);
        
        let a=new StationPlus(1,1);
        let b=new StationMinus(1,3);
        this.field.addStation(a);
        this.field.addStation(b);
        a.addDownStation(b);
    }
    update(){
        KeyManager.update();
        if(KeyManager.down('ESC')){
            console.log("esc");
            SceneManager.start(TitleScene);
        }
        this.field.update();
    }
}