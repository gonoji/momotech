import { GameEvent } from "../../events/event";
import { Depth } from "../../utils/depthManager";
import { SceneManager } from "../../utils/sceneManager";

type stationType = 'plus' | 'minus';

export abstract class Station{
    static size: number = 100;
    static count: number = 0;

    private id: number;
    private sprite: Phaser.GameObjects.Sprite;
    readonly nexts: { up: Station, down: Station, right: Station, left: Station };
    constructor(
        public x: number,
        public y: number,
        public z: number,
        readonly stationType: stationType
    ){
        this.id = Station.count++;
        this.sprite = SceneManager.scene.add.sprite(x, y, stationType).setDepth(Depth.of('field', 0));
        this.nexts = { up: null, down: null, right: null, left: null };
        this.calcPosition();
    }
    update(){
    }
    final(){
        this.sprite.destroy();
    }
    private calcPosition(){
        this.sprite.x = this.x * Station.size;
        this.sprite.y = this.y * Station.size;
    }
    addUpStation(other: Station){
        this.nexts.up = other;
        other.nexts.down = this;
    }

    addDownStation(other: Station){
        this.nexts.down = other;
        other.nexts.up = this;
    }

    addLeftStation(other: Station){
        this.nexts.left = other;
        other.nexts.right = this;
    }
    addRightStation(other: Station){
        this.nexts.right = other;
        other.nexts.left = this;
    }

    abstract event(): GameEvent;
}