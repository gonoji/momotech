import { GameEvent } from "../../events/event";
import { SceneManager } from "../../utils/sceneManager";

type stationType = 'plus' | 'minus';

export abstract class Station{
    static size: number = 128;
    private static id_max: number = 2147483647;

    private sprite: Phaser.GameObjects.Sprite;
    readonly nexts: { up: Station, down: Station, right: Station, left: Station };
    constructor(
        public x: number,
        public y: number,
        public z: number,
        readonly stationType: stationType,
        public id: number=-1
    ){
        if(id==-1)
            this.id = this.getRandomInt(Station.id_max);
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
    getRandomInt(max): number{
        return Math.floor(Math.random() * max);
    }
      

    abstract event(): GameEvent;
}