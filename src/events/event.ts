import { GameData } from "../gameData/gameData";

export interface GameEvent<T>{

    /** イベントの初期化
     */
    init(): void;

    /** イベントの処理
     * @returns イベントが終了するかどうか
     */
    update(gameData: GameData): boolean;

    /** イベントの結果
     * @returns イベントの結果
     */
    result(): T;

    /** イベントの終了処理
     */
    final(): void;
}
