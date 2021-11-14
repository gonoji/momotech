import { GameData } from "../gameData/gameData";

export interface GameEvent<T>{

    /** イベントの初期化
     */
    init(): void;

    /** イベントの処理
     * @returns イベントが終了する場合はその結果 `result` を持つオブジェクト、継続する場合はなし（`undefined`）
     */
    update(gameData: GameData): {result: T};

    /** イベントの終了処理
     */
    final(): void;
}
