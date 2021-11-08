import { Station } from "../station";

export class StationPlus extends Station{
    constructor(x:number,y:number,z:number=0){
        super(x,y,z,'PLUS','plus');
    }
    final(){
    }
}