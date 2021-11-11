const alphabetKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;
const numberKeys = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'] as const;
const otherKeys = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'ESC', 'BACKSPACE', 'SHIFT', 'ENTER', 'PLUS', 'MINUS'] as const;
const keyNames = [...alphabetKeys, ...numberKeys, ...otherKeys] as const;

// type alphabetKey = typeof alphabetKeys[number];
type numberKey = typeof numberKeys[number];
type KeyName = typeof keyNames[number];

export class KeyManager {
    static keys: { [key in KeyName]?: Phaser.Input.Keyboard.Key };
    static counts: { [key in KeyName]?: number };
    static init(scene: Phaser.Scene){
        this.keys = {};
        this.counts = {};
        for(const key of keyNames){
            this.keys[key] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
            this.counts[key] = 0;
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
    static replaceKey(key1: KeyName, key2: KeyName){
        [this.keys[key1], this.keys[key2]] = [this.keys[key2], this.keys[key1]];
    }
    static getKey(key: KeyName): Phaser.Input.Keyboard.Key{
        if(this.keys[key]) return this.keys[key];
        throw new Error(`キー ${key} が見つかりません`);
    }

    static numberToKey(num: number){
        return numberKeys[num];
    }
    static keyToNumber(key: numberKey){
        return numberKeys.indexOf(key);
    }
}
