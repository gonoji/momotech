import { KeyManager } from "../utils/keymanager";
import { SceneManager } from "../utils/sceneManager";
import { TitleScene } from "./titleScene";

export class TestScene extends Phaser.Scene {
    constructor() {
        //識別ID設定のみ
        super({
            key: "TestScene"
        });
    }

    init():void{
        console.log("init : testScene");
    }
    //本来はこのメソッドで、画像ファイルなどのロード
    preload(): void {
        //今回はコンソール表示だけ
        console.log("Hello Phaser");
    }
    private startText?: Phaser.GameObjects.Text // 追加
    private ellipse?: Phaser.GameObjects.Ellipse // 追加

    private bk_color: string = '0xeeeeee' // 追加
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'red', fontSize: '70px' } //追加

    private static num:integer =0
    create():void {
        this.cameras.main.setBackgroundColor(this.bk_color)
        
        this.startText = this.add.text(parseInt(this.game.config.width.toString())/2, parseInt(this.game.config.height.toString())/2, ('Test'+TestScene.num++), this.fontStyle)
        

        this.startText.setOrigin(0.5)
        this.startText.setInteractive()
        this.startText
        this.startText.on('pointerdown', () => {
            SceneManager.set("TitleScene",TitleScene,this);
        })

        
        this.ellipse=this.add.ellipse(0,0,100,100,0x00ff00);


    }
    update():void{
        if(KeyManager.isDown("UP")){
            this.ellipse.y-=5;
        }
        if(KeyManager.isDown("DOWN")){

            this.ellipse.y+=5;
        }
        if(KeyManager.isDown("LEFT")){

            this.ellipse.x+=5;
        }
        if(KeyManager.isDown("RIGHT")){
            console.log("right");
            this.ellipse.x-=5;
        }
    }
}