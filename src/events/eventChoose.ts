import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { Window } from "../utils/window";

/** 選択肢を選ぶイベント
 * @param choices 有効選択肢のリスト
 * @param choiceCancel 無効選択肢（キャンセルと等価）
 * @returns 有効選択肢が選ばれたらそれ、無効選択肢が選ばれたら `null`
 */

class Choices<T extends string>{
    index = 0;
    readonly texts: string[];
    constructor(private readonly choices: readonly T[], private readonly choiceCancel?: string){
        this.texts = this.canCancel? [...choices, choiceCancel]: [...choices];
    }
    down(){
        if(this.index < this.texts.length) this.index++;
    }
    up(){
        if(this.index > 0) this.index--;
    }
    choose(): { result: T | null }{
        return { result: this.index < this.choices.length? this.choices[this.index]: null };
    }
    cancel(): { result: null } | void{
        if(!this.canCancel) return;
        if(this.index == this.choices.length){
            return { result: null };
        }
        this.index = this.choices.length;
    }
    private get canCancel(){
        return this.choiceCancel != null;
    }
}

export class EventChoose<TChoice extends string, TCancel extends string> implements GameEvent<TChoice | null>{
    private window: Window;
    private readonly choices: Choices<TChoice>;
    constructor(choices: readonly TChoice[], choiceCancel?: TCancel){
        this.choices = new Choices(choices, choiceCancel);
    }
    init(){
        this.window = new Window(30, 30, 0, this.choices.texts);
    }
    update(){
        if(KeyManager.down('DOWN')) this.choices.down();
        if(KeyManager.down('UP')) this.choices.up();
        if(KeyManager.down('X')){
            const cancel = this.choices.cancel();
            if(cancel) return cancel;
        }
        
        this.window.messages.forEach(
            (message, index) => message.setColor(index == this.choices.index? 'red': 'black')
        );

        if(KeyManager.down('Z')) return this.choices.choose();
    }
    final(){
        this.window.final();
    }
}