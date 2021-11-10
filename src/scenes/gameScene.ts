import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
import { Field } from "../gameData/field";
import { GameData } from "../gameData/gameData";
import { FileIO } from "../utils/fileIO";
//import { Field } from "../maps/field";
//import { FileIO } from "../utils/fileIO";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class GameScene extends Phaser.Scene {
    private eventManager: EventManager;
    private gameData: GameData;
    field: Field;
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
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.field = new Field();
        console.log(FileIO.getText('test'));
    }
    update(){
        KeyManager.update();
        this.gameData.update();
        if(this.eventManager.update() == 'ends'){
            SceneManager.start(TitleScene);
            this.gameData.final();
        }
    }
}
