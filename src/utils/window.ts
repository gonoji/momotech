import { SceneManager } from "./sceneManager";

export class Window{
    private readonly box: Phaser.GameObjects.Rectangle;
    private readonly _texts: Phaser.GameObjects.Text[];
    static margin = 16;
    static fontSize = 32;

    /** 位置・サイズを指定してウィンドウを作成
     * @param x ウィンドウ左上の `x` 座標（負値を指定すると、画面右端が基準になる）
     * @param y ウィンドウ左上の `y` 座標（負値を指定すると、画面下端が基準になる）
     * @param w ウィンドウの幅（負値を指定すると、画面右端からの距離）
     * @param texts ウィンドウに表示する行ごとのテキスト、またはその行数
     */
    constructor(
        x: number,
        y: number,
        w: number,
        texts: string[] | number
    ){
        if(typeof texts == 'number') texts = Array(texts).fill('');
        const h = this.yText(texts.length) + Window.margin;
        const layer = SceneManager.layer('dialog');
        if(w < 0) w += layer.width - x;
        if(x < 0) x += layer.width - w;
        if(y < 0) y += layer.height - h;
        
        const wFrame = 4;
        this.box = layer.add
            .rectangle(x - wFrame, y - wFrame, w + 2*wFrame, h + 2*wFrame, 0x000088, 0.5)
            .setStrokeStyle(wFrame, 0x080808)
            .setOrigin(0);
        this._texts = texts.map((text, line) => layer.add
            .text(x + Window.margin, y + this.yText(line) + wFrame, text, { fontSize: `${Window.fontSize}px`, color: 'black' })
            .setPadding(0, Window.margin, 0, 0)
        );
    }
    final(){
        this.box.destroy();
        this._texts.forEach(text => text.destroy());
    }

    private yText(line: number){
        return line * (Window.fontSize + Window.margin);
    }

    /** 表示するテキストを設定する
     * @param texts 表示するテキスト
     */
    set text(texts: string[]){
        if(texts.length > this._texts.length) throw new Error('表示するテキストの行数が多すぎます');
        texts.forEach((text, line) => this._texts[line].setText(text));
    }

    static lower(){
        const margin = 30;
        return new Window(margin, -margin, -margin, 3);
    }
}