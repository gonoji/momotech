import { Scene } from "../scenes/scene";
import { KeyManager } from "./keyManager";

export class SceneManager{
    private static currents: { [id: string]: Scene } = {};
    static init(scene: Scene){
        KeyManager.init(scene);
        this.currents[scene.id] = scene;
    }
    /** シーンを切り替える
     * @param scene 切り替え先のシーン
     */
    static start(scene: Scene){
        // for(const id in this.currents) this.scenePlugin.remove(id);
        this.scenePlugin.add(scene.id, scene);
        this.scenePlugin.start(scene);
        this.currents[scene.id] = scene;
    }

    /** シーンを（レイヤーとして）追加する
     * @param scene 追加するシーン
     */
    static add(scene: Scene){
        this.scenePlugin.add(scene.id, scene);
        this.scenePlugin.launch(scene);
        this.currents[scene.id] = scene;
    }

    static scene(id?: string): Scene{
        if(!id) return Object.values(this.currents)[0];

        const scene = this.currents[id];
        if(!scene) throw new Error(`SceneManager.scene: シーン '${id}' が存在しません`);
        return scene;
    }
    private static get scenePlugin(){
        return this.scene().scene;
    }

    static log(id: string){
        console.log(id, this.currents);
    }
}
