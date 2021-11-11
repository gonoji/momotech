import { Field } from "./field";
import { GameDate } from "./gameDate";
import { Player } from "./player";

export class GameData{
    readonly field: Field;
    readonly players: Player[];
    readonly date: GameDate;

    constructor(numPlayer: number){
        this.field = new Field();
        this.players = Array(numPlayer).fill(null).map((_, id) => new Player(id));
        this.date = new GameDate();
    }
    create(){
        this.field.create();
        for(const player of this.players) player.create(this.field.stations[0]);
    }
    update(){
        this.field.update();
    }
    final(){
        this.field.final();
    }

    get turnPlayer(){
        return this.players[this.date.week];
    }
}
