import { Direction } from "../utils/direction";
import { SceneManager } from "../utils/sceneManager";
import { Card } from "./cards/card";
import { Field } from "./field";
import { Station } from "./stations/station";

export class Player{
    location: Station;
    money: number = 10;
    readonly cards: Card[] = [];

    private sprite: Phaser.GameObjects.Group;

    constructor(readonly id: number){
    }
    create(initial: Station){
        this.location = initial;
        const layer = SceneManager.scene('field');

        // 画像ロード周りが整備されるまで group {ellipse + text} で代用
        const size = 72;
        this.sprite = layer.add.group()
            .add(layer.add.ellipse(0, 0, size, size, 0x88ff00))
            .add(layer.add.text(0, 0, `${this.id + 1}`, {color: 'black', fontSize: '50px'}).setOrigin(0.5))
            .setDepth(8);
        this.updatePos();
    }
    final(){
        this.sprite.destroy(true);
    }

    /** 隣の駅に移動する
     * @param dir 移動する方向
     * @returns 移動できた（進む方向に駅があった）かどうか
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
    canMove(dir: Direction.asType){
        return true; // todo: 要石があったらfalseに
    }

    private updatePos(){
        const [x, y] = Field.at(this.location.x, this.location.y);
        this.sprite.setXY(x, y);
    }
}
