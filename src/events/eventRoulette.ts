import { GameEvent } from "./event";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { Window } from "../utils/window";

/**
 * ルーレットを回すイベント
 * @param generateChoice 選択肢を生成する関数
 * @param toText 選択肢を表示する関数
 * @returns 抽選された選択肢
 */
export class EventRoulette<T> implements GameEvent<T>{
    private window?: Window;
    private choice?: T;
    private rolls: boolean = true;
    constructor(private generateChoice: () => T, private toText: (choice: T) => string){
    }

    init(){
        const layer = SceneManager.layer('dialog');
        const margin = 0.1 * layer.width;
        this.window = new Window(margin, 0.4 * layer.height, -margin, 1, 50);
    }
    /**
     * @returns 選ばれた選択肢
     */
    update(){
        if(!this.choice || this.rolls){
            this.choice = this.generateChoice();
            this.window?.setTexts([this.toText(this.choice)]);
        }
        if(KeyManager.down('Z')){
            if(!this.rolls) return { result: this.choice };
            this.rolls = false;
        }
    }
    final(){
        this.window?.final();
    }
}