import { Field } from "./field";
import { Player } from "./player";

export class GameData{
    readonly field: Field;
    readonly players: Player[];

    constructor(numPlayer: number){
        this.field = new Field();
        this.players = Array(numPlayer).fill(null).map((_, id) => new Player(id));
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
}
