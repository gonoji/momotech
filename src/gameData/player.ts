import { Depth } from "../utils/depthManager";
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
        const [x, y] = Field.at(this.location.x, this.location.y);
        this.sprite = SceneManager.scene.add.group()
            .add(SceneManager.scene.add.ellipse(0, 0, size, size, 0x88ff00))
            .add(SceneManager.scene.add.text(0, 0, `${this.id + 1}`, {color: 'black', fontSize: '50px'}).setOrigin(0.5))
            .setX(x).setY(y)
            .setDepth(Depth.of('field', 8));
    }
    final(){
        this.sprite.destroy(true);
    }
}
