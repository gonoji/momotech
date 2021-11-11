import { SceneManager } from "./sceneManager";

type fileType = 'image' | 'text' | 'json';
type json = any;

export class FileIO{

    static preload(count: number){
        switch(count){
        case 0:
            FileIO.load('json', 'jsonsJson', 'static/json/jsons.json');
            return;
        case 1:
            FileIO.import('json', FileIO.getJson('jsonsJson'));
            return;
        case 2:
            FileIO.import('image', FileIO.getJson('imagesJson'));
            FileIO.import('text', FileIO.getJson('textsJson'));
            return;
        }
    }
    private static import(type: fileType, json: json){
        console.log(json);
        json.contents.forEach((e: json) => FileIO.load(type, e.name, json.baseURL + e.url));
    }
    private static load(type: fileType, name: string, url: string){
        SceneManager.scene.load[type](name, url);
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
