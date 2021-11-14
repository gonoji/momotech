import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { GameData } from "./gameData";

export class Frame{
    private frameDisplay: {
        date: GameObjects.Text,
        player: GameObjects.Text,
        cash: GameObjects.Text,
        card: GameObjects.Text
    };

    constructor(){
    }

    create(){
        const layer = SceneManager.layer('property');
        this.frameDisplay = {
            date: layer.add.text(layer.width/2, 0, '', {color: 'white', fontSize: '50px'}).setOrigin(0.5, 0),
            player: layer.add.text(layer.width/2, 50, '', {color: 'white', fontSize: '50px'}).setOrigin(0.5, 0),
            cash: layer.add.text(layer.width/2, 100, '', {color: 'white', fontSize: '50px'}).setOrigin(0.5, 0),
            card: layer.add.text(layer.width/2, 150, '', {color: 'white', fontSize: '50px'}).setOrigin(0.5, 0)
        }; 
    }

    update(gameData: GameData){
        this.frameDisplay.date.setText(`${gameData.date.month}月`);
        this.frameDisplay.player.setText(`${gameData.turnPlayer.id}社長`); //後でidをnameにしたい
        this.frameDisplay.cash.setText(`${gameData.turnPlayer.money}円`);
        this.frameDisplay.card.setText(`カード: ${gameData.turnPlayer.cards.length}枚`);
    }

    final(){
        Object.keys(this.frameDisplay).forEach(key => {
            this.frameDisplay[key].destroy();
        });
    }

}