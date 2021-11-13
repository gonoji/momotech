import { EventManager } from "../events/eventManager";
import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Scene } from "./scene";
import { TitleScene } from "./titleScene";

export class GameScene extends Scene{
    private eventManager: EventManager;
    private gameData: GameData;
    
    constructor(numPlayers: number){
        super(`GameScene${numPlayers}`);
        this.gameData = new GameData(numPlayers);
    }
    init(){
        SceneManager.init(this);
    }
    preload(){

    }
    create(){
        this.gameData.create();
        
        // -------------カメラの設定----------------------------
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.cameras.main.setPosition(45, 45);
        this.cameras.main.setSize(1320, 990);
        //遠くにする。もしくはignoreでこの画像以外すべてのオブジェクトを指定する。
        const frame =SceneManager.scene.add.sprite(20000, 20000, 'frame');
        this.cameras.main.ignore(frame);
        const subCamera = this.cameras.add(0, 0, 1920, 1080, false, 'sub').setBackgroundColor('0x00ff00');
        subCamera.startFollow(frame);
        //カメラの優先度が配列順になっているっぽい(後から追加したものが上に来る)ので優先度を変更
        this.cameras.cameras = this.cameras.cameras.reverse();
        // -----------------------------------------------------
        
        this.eventManager = new EventManager(this.gameData);
    }
    update(){
        KeyManager.update();
        this.gameData.update();
        
        if(KeyManager.pressed('PLUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.getCamera('').setZoom(this.cameras.getCamera('').zoom*0.95);
        }
        if(KeyManager.down('S')&&KeyManager.pressed('SHIFT')){
            this.load.saveJSON(this.gameData.field);
        }
        if(this.eventManager.update()){
            SceneManager.start(new TitleScene());
            this.gameData.final();
        }
    }
}
