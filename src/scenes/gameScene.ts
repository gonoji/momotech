import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class GameScene extends Phaser.Scene {
    private eventManager: EventManager;
    constructor(){
        super({ key: 'GameScene' });
    }
    init(){
        SceneManager.init(this);
        EventManager.init(this);
        this.eventManager = new EventManager(eventTurn());
    }
    preload(){
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');
    }
    update(){
        KeyManager.update();
        if(this.eventManager.update() == 'ends') SceneManager.start(TitleScene);
    }
}
