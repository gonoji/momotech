import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
import { GameData } from "../gameData/gameData";
//import { Field } from "../maps/field";
import { FileIO } from "../utils/fileIO";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class GameScene extends Phaser.Scene {
    private eventManager: EventManager;
    private gameData: GameData;
    constructor(numPlayers: number){
        super({ key: 'GameScene' });
        this.gameData = new GameData(numPlayers);
    }
    init(){
        SceneManager.init(this);
        this.eventManager = new EventManager(eventTurn());
    }
    preload(){

        this.load.baseURL = 'static/images/';
	    this.load.image('plus', 'masu_plus_128.png');
	    this.load.image('minus', 'masu_minus_128.png');
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');
        //this.field = Field.generate();
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
