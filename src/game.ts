import "phaser";
import { PreloadScene } from "./scenes/preloadScene";

// windowイベントで、ロードされたらゲーム開始
window.addEventListener('load', () => {
    const scene = new PreloadScene();
    const game = new Phaser.Game({
        title: 'Title',     // タイトル
        version: '0.0.1',   // バージョン
        width: 1280,        // 画面幅
        height: 720,        // 画面高さ
        parent: 'game',     // DOM上の親
        type: Phaser.AUTO,  // canvasかwebGLかを自動選択
        scene               // 利用するSceneクラス
    });
});
