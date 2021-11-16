import { Game } from "../game";
import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Layer, Scene } from "./scene";
import { TitleScene } from "./titleScene";
import { RoutineManager } from "../events/routineManager";

export class GameScene extends Scene{
    private routineManager: RoutineManager;
    private gameData: GameData;
    
    constructor(numPlayers: number){
        super('game');
        this.gameData = new GameData(numPlayers);
    }
    init(){
        super.init();
        const margin = 30;
        const height = Game.height - 2 * margin;
        const width = Math.floor(height * 4/3);
        SceneManager.add(new Layer('field', { x: margin, y: margin, w: width, h: height }));
        SceneManager.add(new Layer('dialog', { x: margin, y: margin, w: width, h: height }));
        SceneManager.add(new Layer('property', {x: 2*margin+width, y: margin, w: Game.width-width-3*margin, h: height}));
    }
    create(){
        this.gameData.create();
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.routineManager = new RoutineManager(this.gameData);
        SceneManager.scene.add.sprite(0, 0, 'frame').setOrigin(0).setScale(2/3);
    }
    update(){
        KeyManager.update();
        this.gameData.update();
        this.routineManager.update(this.gameData);

        if(KeyManager.pressed('PLUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom*1.05);
        }
        if(KeyManager.pressed('MINUS')){
            this.cameras.main.setZoom(this.cameras.main.zoom*0.95);
        }
        if(KeyManager.down('S') && KeyManager.pressed('SHIFT')){
            this.load.saveJSON(this.gameData.field);
        }
        if(KeyManager.down('ESC')){
            this.gameData.final();
            SceneManager.start(new TitleScene());
        }
    }
}
