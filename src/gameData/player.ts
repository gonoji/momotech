import { Depth } from "../utils/depthManager";
import { Direction } from "../utils/direction";
import { SceneManager } from "../utils/sceneManager";
import { Field } from "./field";
import { Station } from "./stations/station";

export class Player{
    public location: Station;
    private sprite: Phaser.GameObjects.Group;

    constructor(readonly id: number){
    }
    create(initial: Station){
        this.location = initial;
        // 画像ロード周りが整備されるまで group {ellipse + text} で代用
        const size = 72;
        this.sprite = SceneManager.scene.add.group()
            .add(SceneManager.scene.add.ellipse(0, 0, size, size, 0x88ff00))
            .add(SceneManager.scene.add.text(0, 0, `${this.id + 1}`, {color: 'black', fontSize: '50px'}).setOrigin(0.5))
            .setDepth(Depth.of('field', 8));
        this.updatePos();
    }
    final(){
        this.sprite.destroy(true);
    }

    /** 隣の駅に移動する
     * @param dir 移動する方向
     * @returns 移動できた（進む方向に駅がない・塞がれていないなどにより、移動が失敗していない）かどうか
     */
    moveTo(dir: Direction.asType){
        const next = this.location.nexts[dir];
        if(next){
            this.location = next;
            this.updatePos();
            return true;
        }
        return false;
    }

    private updatePos(){
        const [x, y] = Field.at(this.location.x, this.location.y);
        this.sprite.setXY(x, y);
    }
}
