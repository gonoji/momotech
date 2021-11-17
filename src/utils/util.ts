export namespace Util{

    /** 指定した範囲の整数をランダムに得る
     * @returns [`lb`, `ub`) 中のランダムな整数
     */
     export function getRandomInt(lb: number, ub: number){
        return Math.floor(Math.random() * (ub - lb)) + lb;
    }
    
    /** 指定した範囲の実数をランダムに得る
     * @returns [`lb`, `ub`) 中のランダムな実数
     */
     export function getRandomDouble(lb: number, ub: number){
        return Math.random() * (ub - lb) + lb;
    }

    /** 排他的論理和をとる
     * @returns a xor b
     */
    export function xor(a : boolean, b : boolean):boolean {
        return ( a || b ) && !( a && b );
    }

    /** 配列の要素をランダムに得る
     * @returns `array` 中のランダムな要素
     */
     export function pick<T>(array: T[]){
        return array[Util.getRandomInt(0, array.length)];
    }

    /** ランダムなIDを取得する
     * @returns ランダムな文字列
     */
     export function getRandomStringID(length: number){
        let id = '';
        for(let i = 0; i < length; i++){
            id += pick<String>('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''));
        }
        return id;
    }
}