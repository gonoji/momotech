import { SceneManager } from "./sceneManager";

export class Window{
    private box: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;
    
    /** 位置・サイズを指定してウィンドウを作成
     * @param x ウィンドウ左上の `x` 座標（負値を指定すると、画面右端が基準になる）
     * @param y ウィンドウ左上の `y` 座標（負値を指定すると、画面下端が基準になる）
     * @param w ウィンドウの幅（負値を指定すると、画面右端からの距離）
     * @param h ウィンドウの高さ（負値を指定すると、画面下端からの距離）
     */
    constructor(
        x: number,
        y: number,
        w: number,
        h: number
    ){
        const layer = SceneManager.layer('dialog');
        if(w < 0) w += layer.width - x;
        if(h < 0) h += layer.height - y;
        if(x < 0) x += layer.width - w;
        if(y < 0) y += layer.height - h;
        
        this.box = layer.add.rectangle(x, y, w, h, 0x000088, 0.5)
            .setStrokeStyle(4, 0x080808)
            .setOrigin(0)
            .setDepth(0);

        console.log(x, y, w, h);
    }
    final(){
        this.box.destroy();
    }

    static lower(){
        const margin = 30;
        return new Window(margin, -margin, -margin, 200);
    }
}