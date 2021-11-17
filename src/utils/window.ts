import InputText from "phaser3-rex-plugins/plugins/inputtext";
import { setEnvironmentData } from "worker_threads";
import { Estate } from "../gameData/estates/estate";
import { StationEstate } from "../gameData/stations/stationEstate";
import { EditScene } from "../scenes/editScene";
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
    names: InputText[];
    prices: InputText[];
    profits: InputText[];
    isAgris: InputText[];
    texts: Phaser.GameObjects.Text[];
    addText: Phaser.GameObjects.Text;
    removeText: Phaser.GameObjects.Text;
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
        this.names = [];
        this.profits = [];
        this.isAgris = [];
        this.prices = [];
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
        this.texts.forEach(text => text.destroy());
        this.names.forEach(inputText => inputText.destroy());
        this.prices.forEach(inputText => inputText.destroy());
        this.profits.forEach(inputText => inputText.destroy());
        this.isAgris.forEach(inputText => inputText.destroy());
        this.addText.destroy();
        this.removeText.destroy();
    }

    private yText(line: number){
        return line * (this.fontSize + Window.margin);
    }

    setData(editScene: EditScene,station: StationEstate){
        editScene.estateEditFlag = true;
        this.texts = [];
        this.names = [];
        this.profits = [];
        this.isAgris = [];
        this.prices = [];
        station.estates.forEach(e => {
            this.addData(e);
        });
        const layer = SceneManager.layer('dialog');
        this.addText = layer.add.text(450, 660, 'add').setInteractive();
        this.addText.on('pointerdown', function (pointer) {
            station.addEstate(new Estate({name: "new Estate", price: 100, profit: 10, isAgri: false}, station));
            
            editScene.interactiveWindow.removeData();
            editScene.interactiveWindow.setData(editScene, station);
        });
        this.setVisible(true);

        this.removeText = layer.add.text(520, 660, 'remove').setInteractive();
        this.removeText.on('pointerdown', function (pointer) {
            station.removeEstate(editScene.interactiveWindow.names.length-1);
            editScene.interactiveWindow.removeData();
            editScene.interactiveWindow.setData(editScene, station);
        });
        this.setVisible(true);
    }
    addData(estate: Estate){
        const layer = SceneManager.layer('dialog');
        this.texts.push(layer.add.text(100 + Math.floor(this.names.length / 6) * 250, 60 + (this.names.length % 6) * 100, 'name   : ').setOrigin(0.5));
        this.texts.push(layer.add.text(100 + Math.floor(this.names.length / 6) * 250, 80 + (this.names.length % 6) * 100, 'price  : ').setOrigin(0.5));
        this.texts.push(layer.add.text(100 + Math.floor(this.names.length / 6) * 250, 100 + (this.names.length % 6) * 100, 'profit : ').setOrigin(0.5));
        this.texts.push(layer.add.text(100 + Math.floor(this.names.length / 6) * 250, 120 + (this.names.length % 6) * 100, 'isAgri : ').setOrigin(0.5));

        const name = new InputText(layer, 200 + Math.floor(this.names.length / 6) * 250, 60 + this.names.length % 6 * 100, 10, 30, {
            type: 'textarea',
            text: `${estate.name}`,
            fontSize: '15px',});
        layer.add.existing(name);
        name.resize(100, 20)
            .setOrigin(0.5)
            .setFontColor('#000000')
            .on('textchange', function (inputText) {
                estate.name = inputText.text;
                estate.data.name = inputText.text;
                estate.station.estateData.estates[estate.id] = estate.data;
            });
        
        
        this.names.push(name);

        const price = new InputText(layer, 200 + Math.floor(this.prices.length / 6) * 250, 80 + this.prices.length % 6 * 100, 10, 15, {
            type: 'number',
            text: `${estate.price}`,
            fontSize: '15px',});
        layer.add.existing(price);
        price.resize(100, 20)
            .setOrigin(0.5)
            .setFontColor('#000000')
            .on('textchange', function (inputText) {
                estate.price = parseInt(inputText.text);
                estate.data.price = parseInt(inputText.text);
                estate.station.estateData.estates[estate.id] = estate.data;
            });
        
        
        this.prices.push(price);

        const profit = new InputText(layer, 200 + Math.floor(this.profits.length / 6) * 250, 100 + this.profits.length % 6 * 100, 10, 15, {
            type: 'number',
            text: `${estate.profit}`,
            fontSize: '15px',});
        layer.add.existing(profit);
        profit.resize(100, 20)
            .setOrigin(0.5)
            .setFontColor('#000000')
            .on('textchange', function (inputText) {
                estate.profit = parseInt(inputText.text);
                estate.data.profit = parseInt(inputText.text);
                estate.station.estateData.estates[estate.id] = estate.data;
            });
        
        
        this.profits.push(profit);

        const isAgri = new InputText(layer, 200 + Math.floor(this.isAgris.length / 6) * 250, 120 + this.isAgris.length % 6 * 100, 10, 15, {
            type: 'textArea',
            text: `${estate.isAgri}`,
            fontSize: '15px',});
        layer.add.existing(isAgri);
        isAgri.resize(100, 20)
            .setOrigin(0.5)
            .setFontColor('#000000')
            .on('textchange', function (inputText) {
                estate.isAgri = (inputText == 'true' ) ? true : false;
                estate.data.isAgri = estate.isAgri;
                estate.station.estateData.estates[estate.id] = estate.data;
            });
        
        
        this.isAgris.push(isAgri);
    }
    removeData(){
        this.texts.forEach(e =>{
            e.destroy();
        });this.names.forEach(e =>{
            e.destroy();
        });this.prices.forEach(e =>{
            e.destroy();
        });this.profits.forEach(e =>{
            e.destroy();
        });this.isAgris.forEach(e =>{
            e.destroy();
        });
        this.texts = [];
        this.names = [];
        this.profits = [];
        this.isAgris = [];
        this.prices = [];
        this.addText?.destroy();
        this.removeText?.destroy();
        this.setVisible(false);
    }

    /** 画面下に表示される、3 行のテキストボックス */
    static side(){
        const margin = 30;
        return new InteractiveWindow(margin, margin, 560, SceneManager.layer('dialog').height - margin * 2);
    }
    setVisible(visible: boolean){
        this.box.setVisible(visible);
    }
}