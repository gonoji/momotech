import * as fs from "fs"
import * as readline from "readline"
import { SceneManager } from "./sceneManager";

export class FileIO{
    static baseImageURL : string;
    static baseTextURL : string;
    static baseJsonURL : string;

    static init(){
        FileIO.importImages();
        FileIO.importTexts();
        FileIO.importJson();
    }

    static importImages(baseURL : string = 'static/images/'){
        FileIO.baseImageURL = baseURL;
	    this.loadImage('plus', 'masu_plus_128.png');
	    this.loadImage('minus', 'masu_minus_128.png');
        this.loadImage('tate', 'road_tate.png');
        this.loadImage('yoko', 'road_yoko.png');
    }

    static importTexts(baseURL : string = 'static/texts/'){
        FileIO.baseTextURL = baseURL;
        this.loadText('test', 'test.txt');
    }

    static importJson(baseURL : string = 'static/json/'){
        FileIO.baseJsonURL = baseURL;
        this.loadJson('jsonTest', 'test.json');
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
        let scene = SceneManager.scene;
	    scene.load.image(name, FileIO.baseImageURL + url);
    }

    private static loadText(name : string, url : string){
        let scene=SceneManager.scene;
	    scene.load.text(name, FileIO.baseTextURL + url);
    }
    
    private static loadJson(name : string, url : string){
        let scene=SceneManager.scene;
	    scene.load.json(name, FileIO.baseJsonURL + url);
    }
    
}