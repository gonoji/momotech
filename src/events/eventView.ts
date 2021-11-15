
import { Field } from "../gameData/field";
import { GameData } from "../gameData/gameData";
import { Station } from "../gameData/stations/station";
import { GameScene } from "../scenes/gameScene";
import { Direction } from "../utils/direction";
import { KeyManager } from "../utils/keyManager";
import { SceneManager } from "../utils/sceneManager";
import { GameEvent } from "./event";

// const station = 'station' as const;
const resume = 'resume' as const;

export class EventView implements GameEvent<typeof resume>{
    private focus: Phaser.GameObjects.Arc;
    private canGoList: Station[];
    /** フィールドを見渡すイベント
     * @param steps 進むマス数
     */
    constructor(private steps: number){
    }
    init(data: GameData){
        const layer = SceneManager.layer('field');
        const pos = data.turnPlayer.pos;
        this.focus = layer.add.circle(pos.x, pos.y, 100)
            .setStrokeStyle(10, 0xabcdef, 1)
            .setDepth(15);
        layer.cameras.main.startFollow(this.focus);
        this.canGoList = this.canGo(data);
        console.log(this.canGoList.map(station=>station.id));//
    }
    /**
     * @returns 通常フィールド移動に戻るときは `resume`、進むルートを確定させるときはそのルート（未実装）
     */
    update(data: GameData){
        const speed = 5;
        if(KeyManager.pressed('RIGHT')) this.focus.x += speed;
        if(KeyManager.pressed( 'LEFT')) this.focus.x -= speed;
        if(KeyManager.pressed( 'DOWN')) this.focus.y += speed;
        if(KeyManager.pressed(   'UP')) this.focus.y -= speed;

        if(KeyManager.down('X')) return { result: resume };
    }
    final(data: GameData){
        data.turnPlayer.focus();
        this.focus.destroy();
    }

    canGo(data: GameData){
        let possibleDest: {[id: number]: from} = {};
        possibleDest[data.turnPlayer.location.id] = 'CENTER';
        for(let i = 1; i <= this.steps; i++){
            const nextPossibleDest: {[id: number]: from} = {};
            for(const id in possibleDest){
                const next = data.field.stations[id].nexts;
                for(const dir of Direction.asArray){
                    if(next[dir] == null) continue;
                    if(dir == possibleDest[id]) continue;
                    if(nextPossibleDest[next[dir].id] != undefined){
                        nextPossibleDest[next[dir].id] = 'CENTER';
                    }
                    else{
                        nextPossibleDest[next[dir].id] = Direction.opposite(dir);    
                    }
                }               
            }
            possibleDest = nextPossibleDest;
        }
        return Object.keys(possibleDest).map(id => data.field.stations[id]);
    }

}

type from = Direction.asType | 'CENTER';