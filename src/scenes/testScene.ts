import { KeyManager } from "../utils/keymanager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class TestScene extends Phaser.Scene {
    constructor(){
        super({ key: 'TestScene' });
    }

    init(){
        SceneManager.init(this);
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(){
        console.log('Hello Phaser');
    }
    private startText?: Phaser.GameObjects.Text; // 追加
    private ellipse?: Phaser.GameObjects.Ellipse; // 追加
    private bk_color: string = '0xeeeeee'; // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' }; // 追加

    private static num: integer = 0;
    create(){
        this.cameras.main.setBackgroundColor(this.bk_color);
        
        this.startText = this.add.text(parseInt(this.game.config.width.toString())/2, parseInt(this.game.config.height.toString())/2, ('Test' + TestScene.num++), this.fontStyle);
        this.startText.setOrigin(0.5);
        this.startText.setInteractive();
        this.startText.on('pointerdown', () => SceneManager.start(TitleScene));
        
        this.ellipse = this.add.ellipse(0, 0, 100, 100, 0x00ff00);
    }
    update(){
        if(KeyManager.isDown('UP')){
            this.ellipse.y -= 5;
        }
        if(KeyManager.isDown('DOWN')){
            this.ellipse.y += 5;
        }
        if(KeyManager.isDown('LEFT')){
            this.ellipse.x += 5;
        }
        if(KeyManager.isDown('RIGHT')){
            this.ellipse.x -= 5;
        }
    }
}