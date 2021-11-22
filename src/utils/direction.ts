
export namespace Direction{
    export const asArray = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
    export type asType = typeof asArray[number];
    
    export function opposite(dir: asType){
        switch(dir){
            case    'UP': return  'DOWN';
            case  'DOWN': return    'UP';
            case  'LEFT': return 'RIGHT';
            case 'RIGHT': return  'LEFT';
        }
    }
    export function unitVector(dir: asType){
        switch(dir){
            case    'UP': return { x:  0, y: -1 };
            case  'DOWN': return { x:  0, y:  1 };
            case  'LEFT': return { x: -1, y:  0 };
            case 'RIGHT': return { x:  1, y:  0 };
        }
    }
}
