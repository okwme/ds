import { isPowered } from '@app/helpers/power';
import { getTileHeight } from '@app/helpers/tile';
import { UnityComponentProps, useUnityComponentManager } from '@app/hooks/use-unity-component-manager';
import { WorldBuildingFragment, WorldTileFragment, getCoords } from '@downstream/core';
import { memo, useCallback, useMemo, useState } from 'react';
import { TileHighlight } from './TileHighlight';

export interface TileData {
    q: number;
    r: number;
    s: number;
    height: number;
    color: string;
    sendScreenPosition?: boolean;
}

export const Tile = memo(
    ({
        id,
        q,
        r,
        s,
        height,
        color,
        sendScreenPosition,
        onPointerEnter,
        onPointerExit,
        onPointerClick,
    }: UnityComponentProps & TileData) => {
        useUnityComponentManager<TileData>({
            type: 'TileData',
            id,
            data: useMemo(
                () => ({ q, r, s, height, color, sendScreenPosition: !!sendScreenPosition }),
                [q, r, s, height, color, sendScreenPosition]
            ),
            onPointerEnter,
            onPointerExit,
            onPointerClick,
        });

        return null;
    }
);

export const Tiles = memo(
    ({
        tiles,
        buildings,
        currentBlock,
        selectedTiles,
        onClickTile,
    }: {
        tiles: WorldTileFragment[];
        buildings: WorldBuildingFragment[];
        currentBlock: number;
        selectedTiles?: WorldTileFragment[];
        onClickTile: (id: string) => void;
    }) => {
        const [hovered, setHovered] = useState<string | undefined>();
        const hoveredTile = hovered && tiles ? tiles.find((t) => t.id === hovered) : undefined;

        const enter = useCallback((id) => {
            setHovered(id);
        }, []);

        const exit = useCallback((id) => {
            setHovered((prev) => (prev == id ? undefined : prev));
        }, []);

        const tileComponents = useMemo(() => {
            return (tiles || [])
                .filter((t) => !!t.biome)
                .map((t) => {
                    const coords = getCoords(t);
                    const hasPower = isPowered(t, tiles, buildings, currentBlock);
                    return (
                        <Tile
                            sendScreenPosition={false}
                            key={t.id}
                            id={t.id}
                            height={getTileHeight(t)}
                            color={hasPower ? '#ffe193' : '#7288A6'}
                            onPointerEnter={enter}
                            onPointerExit={exit}
                            onPointerClick={onClickTile}
                            {...coords}
                        />
                    );
                });
        }, [tiles, enter, exit, onClickTile, buildings, currentBlock]);

        // const powerlines = useMemo(() => {
        //     return (tiles || [])
        //         .filter((t) => !!t.biome)
        //         .flatMap((t) => {
        //             const fromCoords = getCoords(t);
        //             return t.poweredBy.map((powerSource) => {
        //                 const toCoords = getTileCoordsFromId(powerSource.source.id);
        //                 return (
        //                     <Path
        //                         key={`pow-${t.id}-${powerSource.source.id}`}
        //                         id={`pow-${t.id}-${powerSource.source.id}`}
        //                         qFrom={fromCoords.q}
        //                         rFrom={fromCoords.r}
        //                         sFrom={fromCoords.s}
        //                         heightFrom={getTileHeight(t)}
        //                         qTo={toCoords[0]}
        //                         rTo={toCoords[1]}
        //                         sTo={toCoords[2]}
        //                         heightTo={getTileHeight(t)}
        //                         color={'yellow'}
        //                         width={0.2}
        //                     />
        //                 );
        //             });
        //         });
        // }, [tiles]);

        return (
            <>
                {tileComponents}
                {hoveredTile &&
                    [hoveredTile].map((t) => {
                        const coords = getCoords(t);
                        return (
                            <TileHighlight
                                key={`hov-${t.id}`}
                                id={`hov-${t.id}`}
                                height={getTileHeight(t)}
                                color="white"
                                style="gradient_blue"
                                animation="none"
                                {...coords}
                            />
                        );
                    })}
                {(selectedTiles || []).map((t) => {
                    const coords = getCoords(t);
                    return (
                        <TileHighlight
                            key={`selected-${t.id}`}
                            id={`selected-${t.id}`}
                            height={getTileHeight(t)}
                            color="white"
                            style="gradient_outline"
                            animation="none"
                            {...coords}
                        />
                    );
                })}
            </>
        );
    }
);
