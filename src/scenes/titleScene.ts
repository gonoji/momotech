import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameScene } from "./gameScene";
import { Scene } from "./scene";

export class TitleScene extends Scene{
    private startText?: Phaser.GameObjects.Text // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' } // 追加
    private static num: integer = 0;

    constructor(){
        super('TitleScene');
    }
    init(){
        SceneManager.init(this);
    }
    preload(){
    }
    create(){
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.startText = this.add.text(SceneManager.sceneWidth / 2, SceneManager.sceneHeight / 2, `Title[${TitleScene.num++}]`, this.fontStyle)
            .setOrigin(0.5);
    }
    update(){
        KeyManager.update();
        for(const numPlayer of [1, 2, 3, 4]){
            if(KeyManager.down(KeyManager.numberToKey(numPlayer))){
                SceneManager.start(new GameScene(numPlayer));
                return;
            }
        }
    }
}
