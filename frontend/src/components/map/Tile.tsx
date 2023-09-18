import { UnityComponentProps, useUnityComponentManager } from '@app/hooks/use-unity-component-manager';
import { memo, useMemo } from 'react';

export interface TileData {
    q: number;
    r: number;
    s: number;
    height: number;
    color: string;
}

export const Tile = memo(
    ({ id, q, r, s, height, color, onPointerEnter, onPointerExit, onPointerClick }: UnityComponentProps & TileData) => {
        useUnityComponentManager<TileData>({
            type: 'TileData',
            id,
            data: useMemo(() => ({ q, r, s, height, color }), [q, r, s, height, color]),
            onPointerEnter,
            onPointerExit,
            onPointerClick,
        });

        return null;
    }
);