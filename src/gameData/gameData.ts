import { GameObjects } from "phaser";
import { SceneManager } from "../utils/sceneManager";
import { Card } from "./cards/card";
import { Field } from "./field";
import { Frame } from "./frame"
import { GameDate } from "./gameDate";
import { Player } from "./player";

export class GameData{
    readonly field: Field;
    readonly players: Player[];
    readonly date: GameDate;
    readonly factors: Factors;
    readonly frame: Frame;    

    constructor(numPlayer: number){
        this.field = new Field();
        this.frame = new Frame();
        this.players = Array(numPlayer).fill(null).map((_, id) => new Player(id));
        this.date = new GameDate();
        this.factors = new Factors(this.date);
    }
    create(){
        this.field.create();
        this.frame.create();
        Card.create();
        for(const player of this.players) player.create(this.field.stations[0]);
        
    }
    update(){
        this.field.update();
        this.frame.update(this);
    }
    final(){
        this.field.final();
        this.frame.final();
    }

    get turnPlayer(){
        return this.players[this.date.week];
    }

    static moneyToText(money: number){
        return `${money} 円`;
    }
}

class Factors{
    _business: number = 0;
    constructor(private readonly date: GameDate){
    }
    get inflation(){
        return (this.date.year - 1) * 0.2 + 1;
    }
    get season(){
        return Math.pow(3, [-1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, -1][this.date.month - 1]);
    }
    get business(){
        return Math.pow(4, this._business);
    }
}
