import { Field } from "../maps/field";
import { Station } from "../maps/station";
import { KeyManager } from "../utils/keymanager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class StationTestScene extends Phaser.Scene {
    constructor(){
        super({ key: 'StationTestScene' });
    }
    field :Field;
    init(){
        SceneManager.init(this);
        this.field = new Field();
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        this.load.baseURL='static/';
        
	    this.load.image('plus', 'images/masu_plus_128.png');
        console.log('Hello Phaser');
    }
    private startText?: Phaser.GameObjects.Text; // 追加
    private ellipse?: Phaser.GameObjects.Ellipse; // 追加
    private bk_color: string = '0xeeeeee'; // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' }; // 追加

    private static num: integer = 0;
    create(){
        
        this.cameras.main.setBackgroundColor(this.bk_color);
        
        this.startText = this.add.text(parseInt(this.game.config.width.toString())/2, parseInt(this.game.config.height.toString())/2, ('StationTest'), this.fontStyle);
        this.startText.setOrigin(0.5);
        this.startText.setInteractive();
        this.startText.on('pointerdown', () => SceneManager.start(TitleScene));
        
        this.ellipse = this.add.ellipse(0, 0, 100, 100, 0x00ff00);

        this.field.addStation(new Station(100,200));
    }
    update(){
        if(KeyManager.isDown('UP')){
            this.ellipse.y -= 5;
        }
        if(KeyManager.isDown('DOWN')){
            this.ellipse.y += 5;
        }
        if(KeyManager.isDown('LEFT')){
            this.ellipse.x += 5;
        }
        if(KeyManager.isDown('RIGHT')){
            this.ellipse.x -= 5;
            //this.field.addStation(new Station(0,0));
        }
        this.field.update();
    }
}