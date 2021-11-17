import InputText from "phaser3-rex-plugins/plugins/inputtext";
import { Estate } from "../gameData/estates/estate";
import { StationEstate } from "../gameData/stations/stationEstate";
import { KeyManager } from "./keyManager";
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

export class InteractiveWindow{
    private readonly box: Phaser.GameObjects.Rectangle;
    texts: InputText[];
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
        h: number,
        private readonly fontSize: number = 32
    ){
        this.texts = [];
        const layer = SceneManager.layer('dialog');
        if(w < 0) w += layer.width - x;
        if(x < 0) x += layer.width - w;
        if(y < 0) y += layer.height - h;
        
        const wFrame = 4;
        this.box = layer.add
            .rectangle(x - wFrame, y - wFrame, w + 2*wFrame, h + 2*wFrame, 0x000088, 0.5)
            .setStrokeStyle(wFrame, 0x080808)
            .setOrigin(0);
    }
    final(){
        this.box.destroy();
        this.texts.forEach(inputText => inputText.destroy());
    }

    private yText(line: number){
        return line * (this.fontSize + Window.margin);
    }

    /** 表示するテキストを設定する
     * @param texts 表示するテキスト
     */
    setTexts(texts: string[]){
        /*this.messages = texts.map((text, line) => layer.add
            .text(x + Window.margin, y + this.yText(line) + wFrame, text, { fontSize: `${this.fontSize}px`, color: 'black' })
            .setPadding(0, Window.margin, 0, 0)
            .setDepth(1)
        );*/
    }
    setData(station: StationEstate){
        this.texts = [];
        station.estates.forEach(e => {
            this.addData(e);
        });
        this.setVisible(true);
    }
    addData(estate: Estate){
        const layer = SceneManager.layer('dialog');
        const inputText = new InputText(layer,100, 100 + this.texts.length * 100, 10, 20, {
            type: 'textarea',
            text: estate.name,
            fontSize: '18px',});
        layer.add.existing(inputText);
        inputText.resize(100, 100)
            .setOrigin(0.5)
            .setFontColor('#000000')
            .on('textchange', function (inputText) {
                estate.name = inputText.text;
                estate.data.name = inputText.text;
                estate.station.estateData.estates[estate.id] = estate.data;
            }).on('focus', function (inputText) {
                console.log('On focus');
            })
            .on('blur', function (inputText) {
                console.log('On blur');
            })
            .on('click', function (inputText) {
                //KeyManager.initNodata(SceneManager.layer('dialog'));
                console.log('On click');
            })
            .on('dblclick', function (inputText) {
                console.log('On dblclick');
            });
        this.texts.push(inputText);
    }
    removeData(){
        this.texts.forEach(e =>{
            e.destroy();
        });
        this.texts = [];
        this.setVisible(false);
    }

    /** 画面下に表示される、3 行のテキストボックス */
    static side(){
        const margin = 30;
        return new InteractiveWindow(margin, margin, 300, SceneManager.layer('dialog').height - margin * 2);
    }
    setVisible(visible: boolean){
        this.box.setVisible(visible);
    }
}