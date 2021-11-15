import { SceneManager } from "./sceneManager";

export class Window{
    private readonly box: Phaser.GameObjects.Rectangle;
    readonly messages: Phaser.GameObjects.Text[];
    static margin = 16;

    /** 位置・サイズを指定してウィンドウを作成
     * @param x ウィンドウ左上の `x` 座標（負値を指定すると、画面右端が基準になる）
     * @param y ウィンドウ左上の `y` 座標（負値を指定すると、画面下端が基準になる）
     * @param w ウィンドウの幅（負値を指定すると、画面右端からの距離）
     * @param texts ウィンドウに表示する行ごとのテキスト、またはその行数
     * @param fornSize フォントの大きさ
     */
    constructor(
        x: number,
        y: number,
        w: number,
        texts: readonly string[] | number,
        private readonly fontSize: number = 32
    ){
        if(typeof texts == 'number') texts = Array(texts).fill('');
        const h = this.yText(texts.length) + Window.margin;
        const layer = SceneManager.layer('dialog');
        if(w < 0) w += layer.width - x;
        if(x < 0) x += layer.width - w;
        if(y < 0) y += layer.height - h;
        
        const wFrame = 4;
        this.messages = texts.map((text, line) => layer.add
            .text(x + Window.margin, y + this.yText(line) + wFrame, text, { fontSize: `${this.fontSize}px`, color: 'black' })
            .setPadding(0, Window.margin, 0, 0)
            .setDepth(1)
        );
        const messagesWidth = Math.max(...this.messages.map(message => message.displayWidth));
        this.box = layer.add
            .rectangle(x - wFrame, y - wFrame, Math.max(w, messagesWidth + 2*Window.margin) + 2*wFrame, h + 2*wFrame, 0x000088, 0.5)
            .setStrokeStyle(wFrame, 0x080808)
            .setOrigin(0);
    }
    final(){
        this.box.destroy();
        this.messages.forEach(text => text.destroy());
    }

    private yText(line: number){
        return line * (this.fontSize + Window.margin);
    }

    /** 表示するテキストを設定する
     * @param texts 表示するテキスト
     */
    setTexts(texts: string[]){
        if(texts.length > this.messages.length) throw new Error('表示するテキストの行数が多すぎます');
        texts.forEach((text, line) => this.messages[line].setText(text));
    }

    /** 画面下に表示される、3 行のテキストボックス */
    static lower(){
        const margin = 30;
        return new Window(margin, -margin, -margin, 3);
    }
}