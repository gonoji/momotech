import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
import { Field } from "../gameData/field";
import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class GameScene extends Phaser.Scene {
    private eventManager: EventManager;
    private gameData: GameData;
    field : Field;
    constructor(numPlayers: number){
        super({ key: 'GameScene' });
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
        if(this.eventManager.update()){
            SceneManager.start(TitleScene);
            this.gameData.final();
        }
    }
}
