

export namespace Depth{

    export const layersDepth = {
        field: 0,
        dialog: 1,
    } as const;
    /** 描画レイヤー（後ろに定義されているものほど手前に描画される）*/
    type layer = keyof typeof layersDepth;

    export const RANGE_INTERNAL_DEPTH = 16;
    export const RANGE = Object.keys(layersDepth).length * RANGE_INTERNAL_DEPTH;

    /** GameObject の描画深度を得る
     * @param layer 描画対象のレイヤー
     * @param internalDepth レイヤー内での深度（0 以上 RANGE_INTERNAL_DEPTH 未満で指定）
     * @returns 描画深度（値が大きいほど手前に描画される）
     */
    export function of(layer: layer, internalDepth: number){
        if(!(0 <= internalDepth && internalDepth < RANGE_INTERNAL_DEPTH)) throw new Error(`internalDepth が 0 以上 ${RANGE_INTERNAL_DEPTH} 未満で指定されていません`);
        return layersDepth[layer] * this.RANGE_INTERNAL_DEPTH + internalDepth;
    }
}
