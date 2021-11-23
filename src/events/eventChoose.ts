import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { Window } from "../utils/window";

interface IChoices<T>{
    index: number;
    texts: readonly string[];
    down(): void;
    up(): void;
    choose(): { result: T };
    cancel(): { result: null } | void;
}

class Choices<T extends string> implements IChoices<T>{
    index: number = 0;
    private readonly choices: readonly T[];
    constructor(choices: readonly T[]){
        this.choices = choices;
    }
    down(){
        if(this.index < this.choices.length-1) this.index++;
    }
    up(){
        if(this.index > 0) this.index --;
    }
    choose(){
        return { result: this.choices[this.index] };
    }
    cancel(){
    }
    get texts(){
        return this.choices;
    }
}
class ChoicesCancellable<T extends string> implements IChoices<T | null>{
    private inner: Choices<string>;
    constructor(private readonly choices: readonly T[], choiceCancel: string){
        this.inner = new Choices([...choices, choiceCancel]);
    }
    down(){
        this.inner.down();
    }
    up(){
        this.inner.up();
    }
    choose(){
        return { result: this.choosingCancel()? null: this.choices[this.inner.index] };
    }
    cancel(){
        if(this.choosingCancel()) return { result: null };
        this.inner.index = this.texts.length - 1;
    }
    get index(){
        return this.inner.index;
    }
    get texts(){
        return this.inner.texts;
    }
    private choosingCancel(){
        return this.index == this.texts.length - 1;
    }
}

export namespace EventChoose{
    /** 選択肢を選ぶイベント
     * @param choices 選択肢のリスト
     * @param choiceCancel 
     * @returns 選ばれた選択肢
     */
    export class Forced<T extends string> implements GameEvent<T>{
        private window?: Window;
        private readonly choices: Choices<T>;
        constructor(choices: readonly T[]){
            this.choices = new Choices(choices);
        }
        init(){
            this.window = new Window(30, 30, 0, this.choices.texts);
        }
        update(){
            if(KeyManager.down('DOWN')) this.choices.down();
            if(KeyManager.down('UP')) this.choices.up();
            
            this.window?.messages.forEach(
                (message, index) => message.setColor(index == this.choices.index? 'red': 'black')
            );

            if(KeyManager.down('Z')) return this.choices.choose();
        }
        final(){
            this.window?.final();
        }
    }

    /** 選択肢を選ぶイベント（キャンセル可能）
     * @param choices 有効選択肢のリスト
     * @param choiceCancel 無効選択肢（キャンセルと等価）
     * @returns 有効選択肢が選ばれたらそれ、無効選択肢が選ばれたら `null`
     */
    export class CanCancel<T extends string> implements GameEvent<T | null>{
        private window?: Window;
        private readonly choices: ChoicesCancellable<T>;
        constructor(choices: readonly T[], choiceCancel: string){
            this.choices = new ChoicesCancellable(choices, choiceCancel);
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
            
            this.window?.messages.forEach(
                (message, index) => message.setColor(index == this.choices.index? 'red': 'black')
            );

            if(KeyManager.down('Z')) return this.choices.choose();
        }
        final(){
            this.window?.final();
        }
    }
}