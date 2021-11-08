import { GameEvent } from "../../events/event";
import { SceneManager } from "../../utils/sceneManager";

type stationType = 'plus' | 'minus';

export abstract class Station{
    static size: number = 128;
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
        this.sprite = SceneManager.getCurrentScene().add.sprite(x, y, stationType);
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
    addRightStation(other: Station){
        this.nexts.right = other;
        other.nexts.left = this;
    }
    addDownStation(other: Station){
        this.nexts.down = other;
        other.nexts.up = this;
    }

    abstract event(): GameEvent;
}