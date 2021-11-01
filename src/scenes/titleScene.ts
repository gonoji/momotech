import { KeyManager } from "../utils/keymanager";
import { SceneManager } from "../utils/sceneManager";
import { TestScene } from "./testScene";

export class TitleScene extends Phaser.Scene {
    constructor() {
        //識別ID設定のみ
        super({
            key: "TitleScene"
        });
    }

    init():void{
        console.log("init : titleScene");
        SceneManager.init(this);
        KeyManager.init(this);
        KeyManager.replaceKey("DOWN","S");
        KeyManager.replaceKey("UP","W");
        KeyManager.replaceKey("LEFT","A");
        KeyManager.replaceKey("RIGHT","D");
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
        this.startText = this.add.text(parseInt(this.game.config.width.toString())/2, parseInt(this.game.config.height.toString())/2, ('Titlepopo'+TitleScene.num++), this.fontStyle)
        

        this.startText.setOrigin(0.5)
        this.startText.setInteractive()
        this.startText
        this.startText.on('pointerdown', () => {
            //this.scene.start('TitleScene')
            SceneManager.set("TestScene",TestScene,this);
            console.log("clicked");
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
        if(KeyManager.isDown("RIGHT")){

            this.ellipse.x+=5;
        }
        if(KeyManager.isDown("LEFT")){

            this.ellipse.x-=5;
        }
    }
}