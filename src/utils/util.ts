export namespace Util{
    export function getRandomInt(max : number){
        return Math.floor(Math.random() * max);
    }
    
    export function getRandomDouble(min : number ,max : number){
        return Math.random() * (max - min) + min;
    }

}