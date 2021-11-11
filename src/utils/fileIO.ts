import { SceneManager } from "./sceneManager";

export class FileIO{
    static preload(){
        SceneManager.scene.load.pack('jsons', 'static/jsons/jsons.json');
    }
    static getJson(name: string){
        return SceneManager.scene.cache.json.get(name);
    }
    /*
    static getText(name: string){
        let i = 0;
        const text = SceneManager.scene.cache.text.get(name);
        if(text == undefined){
            console.log('this textName is invalid: ' + name);
            return [];
        }
        const lines: string[] = [];
        let line: string = '';
        while(text[i] != undefined){
            if(text[i] == '\r'){
                i += 2;
                lines.push(line);
                line = '';
            }
            else{
                line += text[i++];
            }
        }
        lines.push(line);
        return lines;
    }
    */
}
