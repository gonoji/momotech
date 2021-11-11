import { EventManager } from "../events/eventManager";
import { routineTurn } from "../events/routineTurn";
import { GameData } from "../gameData/gameData";
import { FileIO } from "../utils/fileIO";
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
        this.eventManager = new EventManager(routineTurn(this.gameData));
    }
    preload(){
        FileIO.preload();
    }
    create(){
        this.gameData.create();
        this.cameras.main.setBackgroundColor('0xeeeeee');
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
            this.load.saveJSON(this.gameData.field.export());
        }
        if(this.eventManager.update(this.gameData)){
            SceneManager.start(new TitleScene());
            this.gameData.final();
        }
    }
}
