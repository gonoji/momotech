import { GameEvent } from "../../events/event";
import { SceneManager } from "../../utils/sceneManager";

export abstract class Card{
    
    private sprite: Phaser.GameObjects.Sprite;
    constructor(public name : string, public cost : number = 100){
        this.sprite = SceneManager.scene.add.sprite(100, 100, 'card').setVisible(false);
    }
    abstract event(): GameEvent<unknown>;
    final(){
        this.sprite.destroy();
    }
}