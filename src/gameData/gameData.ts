import { Field } from "./field";

export class GameData{
    public readonly field: Field;

    constructor(numPlayer: number){
        this.field = new Field();
    }
    create(){
        this.field.create();
    }
    update(){
        this.field.update();
    }
    final(){
        this.field.final();
    }
}
