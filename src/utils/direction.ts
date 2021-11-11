
export namespace Direction{
    export const asArray = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
    export type asType = typeof asArray[number];
    
    export function opposite(dir: asType){
        switch(dir){
            case 'UP': return 'DOWN';
            case 'DOWN': return 'UP';
            case 'LEFT': return 'RIGHT';
            case 'RIGHT': return 'LEFT';
        }
    }
}
