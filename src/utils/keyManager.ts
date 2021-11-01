import { Scene } from "phaser";

export class KeyManager {
    static keys:Map<string,Phaser.Input.Keyboard.Key>;
    static A:Phaser.Input.Keyboard.Key;
    static B:Phaser.Input.Keyboard.Key;
    static C:Phaser.Input.Keyboard.Key;
    static D:Phaser.Input.Keyboard.Key;
    static E:Phaser.Input.Keyboard.Key;
    static F:Phaser.Input.Keyboard.Key;
    static G:Phaser.Input.Keyboard.Key;
    static H:Phaser.Input.Keyboard.Key;
    static I:Phaser.Input.Keyboard.Key;
    static J:Phaser.Input.Keyboard.Key;
    static K:Phaser.Input.Keyboard.Key;
    static L:Phaser.Input.Keyboard.Key;
    static M:Phaser.Input.Keyboard.Key;
    static N:Phaser.Input.Keyboard.Key;
    static O:Phaser.Input.Keyboard.Key;
    static P:Phaser.Input.Keyboard.Key;
    static Q:Phaser.Input.Keyboard.Key;
    static R:Phaser.Input.Keyboard.Key;
    static S:Phaser.Input.Keyboard.Key;
    static T:Phaser.Input.Keyboard.Key;
    static U:Phaser.Input.Keyboard.Key;
    static V:Phaser.Input.Keyboard.Key;
    static W:Phaser.Input.Keyboard.Key;
    static X:Phaser.Input.Keyboard.Key;
    static Y:Phaser.Input.Keyboard.Key;
    static Z:Phaser.Input.Keyboard.Key;
    static UP:Phaser.Input.Keyboard.Key;
    static DOWN:Phaser.Input.Keyboard.Key;
    static LEFT:Phaser.Input.Keyboard.Key;
    static RIGHT:Phaser.Input.Keyboard.Key;
    static SPACE:Phaser.Input.Keyboard.Key;
    static ESC:Phaser.Input.Keyboard.Key;
    static BACKSPACE:Phaser.Input.Keyboard.Key;
    static SHIFT:Phaser.Input.Keyboard.Key;
    static ENTER:Phaser.Input.Keyboard.Key;
    static init(scene : Scene):void{
        console.log("init");
        this.keys=new Map<string,Phaser.Input.Keyboard.Key>();
        this.A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.set("A",this.A);
        this.B = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keys.set("B",this.B);
        this.C = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keys.set("C",this.C);
        this.D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.set("D",this.D);
        this.E = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keys.set("E",this.E);
        this.F = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keys.set("F",this.F);
        this.G = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.keys.set("G",this.G);
        this.H = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.set("H",this.H);
        this.I = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.keys.set("I",this.I);
        this.J = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.keys.set("J",this.J);
        this.K = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keys.set("K",this.K);
        this.L = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.keys.set("L",this.L);
        this.M = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keys.set("M",this.M);
        this.N = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.keys.set("N",this.N);
        this.O = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.keys.set("O",this.O);
        this.P = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keys.set("P",this.P);
        this.Q = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keys.set("Q",this.Q);
        this.R = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keys.set("R",this.R);
        this.S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.set("S",this.S);
        this.T = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keys.set("T",this.T);
        this.U = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.keys.set("U",this.U);
        this.V = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keys.set("V",this.V);
        this.W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.set("W",this.W);
        this.X = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keys.set("X",this.X);
        this.Y = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.keys.set("Y",this.Y);
        this.Z = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keys.set("Z",this.Z);
        this.UP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.set("UP",this.UP);
        this.DOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.set("DOWN",this.DOWN);
        this.RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.set("RIGHT",this.RIGHT);
        this.LEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.set("LEFT",this.LEFT);
        this.SPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys.set("SPACE",this.SPACE);
        this.ESC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.set("ESC",this.ESC);
        this.BACKSPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        this.keys.set("BACKSPACE",this.BACKSPACE);
        this.SHIFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keys.set("SHIFT",this.SHIFT);
        this.ENTER = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keys.set("ENTER",this.ENTER);
    }
    public static isDown(key:string):boolean{
        if(this.keys.has(key))
            return this.keys.get(key).isDown;
        console.log("指定されたキーが見つかりません : "+key);
        return false;
    }public static isUp(key:string):boolean{
        if(this.keys.has(key))
            return this.keys.get(key).isUp;
        console.log("指定されたキーが見つかりません : "+key);
        return false;
    }
    public static replaceKey(key1:string,key2:string):boolean{
        if(this.keys.has(key1)&&this.keys.has(key2)){
            let key01=this.getButton(key1);
            let key02=this.getButton(key2);
            this.keys.delete(key1);
            this.keys.delete(key2);
            this.keys.set(key1,key02);
            this.keys.set(key2,key01);
            return true;
        }
        return false;
    }
    public static getButton(key:string):Phaser.Input.Keyboard.Key{
        if(this.keys.has(key))return this.keys.get(key);
        console.log("指定されたキーが見つかりません : "+key);
        return null;
    }
}