
export interface Event{

    /**
     * イベントの初期化
     */
    init(): void;

    /**
     * イベントの処理
     * @return イベントが終了しないとき `false`、終了するとき `true`、別のイベントに引き継ぐときはそのイベント
     */
    update(): 'continues' | 'ends' | Event;

    /** イベントの終了処理
     * 
     */
    final(): void;
}
