import { SceneManager } from "../utils/sceneManager";

type STATIONTYPE = 'PLUS'|'MINUS'|'MARKET';
export class Station{
    id: number;
    sprite: Phaser.GameObjects.Sprite;
    x: number;
    y: number;
    z: number = 0;
    static size:number=100;
    static count:number=0;
    public nextStation: {up:Station,down:Station,right:Station,left:Station}={up:undefined,down:undefined,right:undefined,left:undefined};
    stationType :STATIONTYPE;
    constructor(x:number,y:number,z:number=0,stationType:STATIONTYPE='PLUS',imageName:string='plus'){
        this.x=x;
        this.y=y;
        this.sprite=SceneManager.getCurrentScene().add.sprite(x,y,imageName);
        this.calcPosition();
        this.z=z;
        this.stationType=stationType;
        this.id=Station.count++;
    }
    update(){
        //console.log(this.id+' '+this.stationType);
        if(this.nextStation.up!=undefined){
            console.log(this.nextStation.up.id);
        }
    }
    calcPosition(){
        this.sprite.x=(this.x*Station.size);
        this.sprite.y=(this.y*Station.size);
    }
    action(){

    }

    addUpStation(other:Station){
        this.nextStation.up=other;
        other.nextStation.down=this;
    }

    addDownStation(other:Station){
        this.nextStation.down=other;
        other.nextStation.up=this;
    }

    addLeftStation(other:Station){
        this.nextStation.left=other;
        other.nextStation.right=this;
    }
    addRightStation(other:Station){
        this.nextStation.right=other;
        other.nextStation.left=this;
    }
}