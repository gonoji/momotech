import { GameData } from "../gameData/gameData";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameEvent } from "./event";

// const station = 'station' as const;
const resume = 'resume' as const;

export class EventView implements GameEvent<typeof resume>{
    private focus: Phaser.GameObjects.Arc;
    /** フィールドを見渡すイベント
     * @param steps 進むマス数
     */
    constructor(private steps: number){
    }
    init(){
        const layer = SceneManager.layer('field');
        this.focus = layer.add.circle(0, 0, 100).setStrokeStyle(10, 0xabcdef, 1);
    }
    /**
     * @returns 通常フィールド移動に戻るときは `resume`、進むルートを確定させるときはそのルート（未実装）
     */
    update(data: GameData){
        if(KeyManager.down('X')) return { result: resume };
    }
    final(){
        this.focus.destroy();
    }
}