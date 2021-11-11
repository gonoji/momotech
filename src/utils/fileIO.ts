import { SceneManager } from "./sceneManager";

export class FileIO{

    static init(){
        FileIO.importJson();
        if(FileIO.count==2){
            FileIO.importImages(this.getJson('imagesJson'));
            FileIO.importTexts(this.getJson('textsJson'));
        }
        FileIO.count++;
    }

    static importImages(json){
        const imageList = json.imagesJson;
        imageList.forEach(ele => {
            const baseURL = ele.baseURL;
            const contents = ele.contents;
            contents.forEach(e => {
                this.loadImage(e.name, baseURL+e.url);
            });
        });
    }

    static importTexts(json){
        const textList = json.textsJson;
        textList.forEach(ele => {
            const baseURL = ele.baseURL;
            const contents = ele.contents;
            contents.forEach(e => {
                this.loadText(e.name, baseURL+e.url);
            });
        });
    }
    static count : number = 0;

    static importJson() {
        if(FileIO.count == 0)
            this.loadJson('json', 'static/json/json.json');
        else if(FileIO.count==1){
            const json = this.getJson('json');
            this.loadJson('imagesJson', json.imagesJson.url);
            this.loadJson('textsJson', json.textsJson.url);
            const jsons = json.jsons;
            jsons.forEach(ele => {
                const baseURL = ele.baseURL;
                const contents = ele.contents;
                contents.forEach(e => {
                    this.loadJson(e.name, baseURL + e.url);
                });
            });
        }
    }

    static getText(name : string) : string[]{
        let i = 0;
        let text = SceneManager.scene.cache.text.get(name);
        if(text == undefined){
            console.log('this textName is invalid : ' + name);
            return [];
        }
        let lines : string[] = [];
        let line : string = '';
        while(text[i] != undefined){
            if(text[i] == '\r'){
                i += 2;
                lines.push(line);
                line = '';
            }else{
                line += text[i++];
            }
        }
        lines.push(line);
        return lines;
    }

    static getJson(name : string): any{
        return SceneManager.scene.cache.json.get(name);
    }

    private static loadImage(name : string, url : string){
        const scene = SceneManager.scene;
	    scene.load.image(name, url);
    }

    private static loadText(name : string, url : string){
        const scene=SceneManager.scene;
	    scene.load.text(name, url);
    }
    
    private static loadJson(name : string, url : string){
        const scene=SceneManager.scene;
	    scene.load.json(name, url);
    }
}