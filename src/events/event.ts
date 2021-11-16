import { GameData } from "../gameData/gameData";

export interface GameEvent<T = unknown>{

    /** イベントの初期化
     */
    init(data: GameData): void;

    /** イベントの処理
     * @returns イベントが終了する場合はその結果 `result` を持つオブジェクト、継続する場合はなし（`undefined`）
     */
    update(data: GameData): {result: T};

    /** イベントの終了処理
     */
    final(data: GameData): void;
}
