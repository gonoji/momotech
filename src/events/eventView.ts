
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
    private canGoMark: Phaser.GameObjects.Arc[] = [];
    /** フィールドを見渡すイベント
     * @param steps 進むマス数
     */
    constructor(private steps: number, private from?: Direction.asType){
    }
    init(data: GameData){
        const layer = SceneManager.layer('field');
        const pos = data.turnPlayer.pos;
        this.focus = layer.add.circle(pos.x, pos.y, 100)
            .setStrokeStyle(10, 0xabcdef, 1)
            .setDepth(15);
        layer.cameras.main.startFollow(this.focus);
        this.canGoList = this.canGo(data);
        for(const i in this.canGoList){
            const pos = Field.at(this.canGoList[i].x, this.canGoList[i].y);
            this.canGoMark[i] = layer.add.circle(pos.x, pos.y, 50)
                .setStrokeStyle(10, 0x00ff00)
        }
        
    }
    /**
     * @returns 通常フィールド移動に戻るときは `resume`、進むルートを確定させるときはそのルート（未実装）
     */
    update(){
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
        this.canGoMark.forEach(mark=>mark.destroy());
    }

    canGo(data: GameData){
        let possibleDest: {[id: number]: from} = {};
        possibleDest[data.turnPlayer.location.id] = this.from ?? 'CENTER';

        for(let i = 1; i <= this.steps; i++){
            const nextPossibleDest: {[id: number]: from} = {};
            for(const id in possibleDest){
                const station = data.field.stations[id];
                for(const dir of Direction.asArray){
                    if(!station.passable(dir, data.field) || dir == possibleDest[id]) continue;
                    const destID = station.nexts[dir].id;
                    if(nextPossibleDest[destID] != undefined){
                        nextPossibleDest[destID] = 'CENTER';
                    }
                    else{
                        nextPossibleDest[destID] = Direction.opposite(dir);    
                    }
                }               
            }
            possibleDest = nextPossibleDest;
        }
        return Object.keys(possibleDest).map(id => data.field.stations[id]);
    }

}

type from = Direction.asType | 'CENTER';