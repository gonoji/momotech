import "phaser";
import "./gameData/cards/cards"; // Card より先に import されないとエラーを吐く
import { TitleScene } from "./scenes/titleScene";

export namespace Game{
    export const width = 1280;
    export const height = 720;
}

// windowイベントで、ロードされたらゲーム開始
window.addEventListener('load', () => {
    const scene = new TitleScene();
    const game = new Phaser.Game({
        title: 'Title',      // タイトル
        version: '0.0.1',    // バージョン
        width: Game.width,   // 画面幅
        height: Game.height, // 画面高さ
        parent: 'game',      // DOM上の親
        type: Phaser.AUTO,   // canvasかwebGLかを自動選択
        scene                // 利用するSceneクラス
    });
});