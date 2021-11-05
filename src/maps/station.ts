import { SceneManager } from "../utils/sceneManager";

type STATIONTYPE = 'PLUS'|'MINUS'|'MARKET';
export class Station{
    id: number;
    sprite: Phaser.GameObjects.Sprite;
    z: number = 0;
    static count:number=0;
    nextStation: {up:Station,down:Station,right:Station,left:Station};
    stationType :STATIONTYPE;
    constructor(x:number,y:number,z:number=0,stationType:STATIONTYPE='PLUS',imageName:string='plus'){
        this.sprite=SceneManager.getCurrentScene().add.sprite(x,y,imageName);
        this.z=z;
        this.stationType=stationType;
        this.id=Station.count++;
    }
    update(){
        //console.log(this.id+' '+this.stationType);
        this.sprite.x++;
    }
}