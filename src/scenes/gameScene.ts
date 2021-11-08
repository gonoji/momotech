import { EventManager } from "../events/eventManager";
import { eventTurn } from "../events/eventTurn";
import { Field } from "../maps/field";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class GameScene extends Phaser.Scene {
    private eventManager: EventManager;
    private field: Field;
    constructor(){
        super({ key: 'GameScene' });
    }
    init(){
        SceneManager.init(this);
        EventManager.init(this);
        this.eventManager = new EventManager(eventTurn());
    }
    preload(){
        this.load.baseURL = 'static/images/';
	    this.load.image('plus', 'masu_plus_128.png');
	    this.load.image('minus', 'masu_minus_128.png');
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.field = Field.generate();
    }
    update(){
        KeyManager.update();
        this.field.update();
        if(this.eventManager.update() == 'ends'){
            SceneManager.start(TitleScene);
            this.final();
        }
    }
    final(){
        this.field.final();
    }
}
