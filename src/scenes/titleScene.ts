import { FileIO } from "../utils/fileIO";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { EditScene } from "./editScene";
import { GameScene } from "./gameScene";
import { Scene } from "./scene";

export class TitleScene extends Scene{
    private startText?: Phaser.GameObjects.Text // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' } // 追加
    private static num: integer = 0;

    constructor(){
        super('TitleScene');
    }
    preload(){
        FileIO.preload();
    }
    create(){
        KeyManager.loadKeyConfig();
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.startText = this.add.text(SceneManager.scene.width / 2, SceneManager.scene.height / 2, `Title[${TitleScene.num++}]`, this.fontStyle)
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
        if(KeyManager.pressed('SHIFT')&&KeyManager.pressed('CTRL')&&KeyManager.down('E')){
            SceneManager.start(new EditScene());
        }
    }
}
