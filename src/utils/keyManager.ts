const keyNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'ESC', 'BACKSPACE', 'SHIFT', 'ENTER'] as const;
type KeyName = typeof keyNames[number];

export class KeyManager {
    static keys: { [key in KeyName]?: Phaser.Input.Keyboard.Key };
    static init(scene: Phaser.Scene){
        this.keys = {};
        for(const key of keyNames) this.keys[key] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
    }
    static isDown(key: KeyName){
        return this.getButton(key).isDown;
    }
    static isUp(key: KeyName){
        return this.getButton(key).isUp;
    }
    static replaceKey(key1: KeyName, key2: KeyName){
        [this.keys[key1], this.keys[key2]] = [this.keys[key2], this.keys[key1]];
    }
    static getButton(key: KeyName): Phaser.Input.Keyboard.Key{
        if(this.keys[key]) return this.keys[key];
        throw new Error('指定されたキーが見つかりません : ' + key);
    }
}
