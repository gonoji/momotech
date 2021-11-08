
export interface GameEvent{

    /**
     * イベントの初期化
     */
    init(): void;

    /**
     * イベントの処理
     * @return イベントが終了しないとき `continues`、終了するとき `ends`、次のイベントに引き継ぐときはそのイベント
     */
    update(): 'continues' | 'ends' | GameEvent;

    /** イベントの終了処理
     * 
     */
    final(): void;
}
