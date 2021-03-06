import { FileIO } from "./fileIO";
import { Util } from "./util";

const alphabetKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;
const numberKeys = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'] as const;
const otherKeys = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'ESC', 'BACKSPACE', 'SHIFT', 'CTRL', 'ENTER', 'PLUS', 'MINUS', 'DELETE'] as const;
const keyNames = [...alphabetKeys, ...numberKeys, ...otherKeys] as const;

// type alphabetKey = typeof alphabetKeys[number];
type numberKey = typeof numberKeys[number];
type KeyName = typeof keyNames[number];

export class KeyManager {
    private static loadKeyConfigFlag : boolean = false;
    static keys: { [key in KeyName]: Phaser.Input.Keyboard.Key };
    static counts: { [key in KeyName]: number };
    static replaceKeys : { key1 : KeyName, key2 : KeyName}[] = [];
    static init(scene: Phaser.Scene){
        // this.keys = Object.fromEntries(keyNames.map(key => [key, key]));
        this.keys = Util.fromEntries(keyNames.map(
            key => [key, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key])]
        ));
        this.counts = Util.fromEntries(keyNames.map(key => [key, 0]));
        scene.input.keyboard.disableGlobalCapture();
        for(const key of this.replaceKeys){
            this.replaceKey(key.key1, key.key2, false);
        }
    }
    static update(){
        for(const key of keyNames){
            if(this.pressed(key)) this.counts[key] ++;
            else this.counts[key] = 0;
        }
    }
    static pressed(key: KeyName){
        return this.getKey(key).isDown;
    }
    static down(key: KeyName){
        return this.counts[key] == 1;
    }
    static replaceKey(key1: KeyName, key2: KeyName, save: boolean = true){
        [this.keys[key1], this.keys[key2]] = [this.keys[key2], this.keys[key1]];
        if(save)
            this.replaceKeys.push({ key1, key2});
    }
    static getKey(key: KeyName): Phaser.Input.Keyboard.Key{
        if(this.keys[key]) return this.keys[key];
        throw new Error(`?????? ${key} ????????????????????????`);
    }

    static numberToKey(num: number){
        return numberKeys[num];
    }
    static keyToNumber(key: numberKey){
        return numberKeys.indexOf(key);
    }
    static loadKeyConfig(){
        if(!KeyManager.loadKeyConfigFlag){
            KeyManager.loadKeyConfigFlag = true;
            const json = FileIO.getJson('keyConfig') as { key1: KeyName, key2: KeyName }[];
            json.forEach(e => this.replaceKey(e.key1, e.key2));
        }
    }
}
