import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
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
        this.eventManager = new EventManager(eventTurn());
    }
    preload(){
    }
    create(){
        this.gameData.create();
        this.cameras.main.setBackgroundColor('0xeeeeee');
    }
    update(){
        KeyManager.update();
        this.gameData.update();
        if(this.eventManager.update(this.gameData)){
            SceneManager.start(new TitleScene());
            this.gameData.final();
        }
    }
}
