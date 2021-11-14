import { Layer, Scene } from "../scenes/scene";
import { KeyManager } from "./keyManager";

export class SceneManager{
    private static current: Scene;
    private static layers: { [id: string]: Layer } = {};
    static init(scene: Scene){
        KeyManager.init(scene);
        this.current = scene;
    }
    /** シーンを切り替える
     * @param scene 切り替え先のシーン
     */
    static start(scene: Scene){
        for(const id in this.layers) this.scenePlugin.remove(id);
        this.scenePlugin.add(scene.id, scene);
        this.scenePlugin.start(scene);
        this.scenePlugin.remove(this.current.id);
        this.current = scene;
    }

    /** レイヤーを追加する
     * @param layer 追加するレイヤー
     */
    static add(layer: Layer){
        this.scenePlugin.add(layer.id, layer);
        this.scenePlugin.launch(layer);
        this.layers[layer.id] = layer;
    }

    static get scene(){
        return this.current;
    }
    static layer(id: string): Layer{
        const layer = this.layers[id];
        if(!layer) throw new Error(`SceneManager.scene: Layer '${id}' が存在しません`);
        return layer;
    }
    private static get scenePlugin(){
        return this.scene.scene;
    }
}
