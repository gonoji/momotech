
export interface GameEvent<T>{

    /** イベントの初期化
     */
    init(): void;

    /** イベントの処理
     * @returns イベントが終了するかどうか
     */
    update(): boolean;

    /** イベントの結果
     * @returns イベントの結果
     */
    result(): T;

    /** イベントの終了処理
     */
    final(): void;
}

export function* result<T>(event: GameEvent<T>){
    yield event;
    return event.result();
}
