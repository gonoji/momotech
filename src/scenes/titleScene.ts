import { FileIO } from "../utils/fileIO";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { EditScene } from "./editScene";
import { GameScene } from "./gameScene";
import { Scene } from "./scene";

export class TitleScene extends Scene{
    constructor(){
        super('title');
    }
    preload(){
        FileIO.preload();
    }
    create(){
        KeyManager.loadKeyConfig();
        this.cameras.main.setBackgroundColor('0xeeeeee');
        this.add.text(this.width / 2, this.height / 2, 'TitleScene', { color: 'red', fontSize: '70px' })
            .setOrigin(0.5);
    }
    update(){
        KeyManager.update();
        for(const numPlayer of [1, 2, 3, 4]){
            if(KeyManager.down(KeyManager.numberToKey(numPlayer))){
                SceneManager.start(new GameScene(numPlayer));
            }
        }
        if(KeyManager.pressed('SHIFT') && KeyManager.pressed('CTRL') && KeyManager.down('E')){
            SceneManager.start(new EditScene());
        }
   }
}
