/** @format */

import { ComponentProps } from '@app/types/component-props';
import { ActionName, ConnectedPlayer, Selection, SelectionSelectors, WorldStateFragment } from '@dawnseekers/core';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import styled from 'styled-components';
import { styles } from './unity-map.styles';

export interface UnityMapProps extends ComponentProps {
    world?: WorldStateFragment;
    player?: ConnectedPlayer;
    selection: Selection & SelectionSelectors;
}

interface Message {
    msg: string;
}

interface DispatchMessage extends Message {
    action: string;
    args: any[];
}

interface SelectTileMessage extends Message {
    tileIDs: string[];
}

interface SetIntentMessage extends Message {
    intent: string;
}

interface SetSeekerMessage extends Message {
    seekerID: string;
}

const StyledUnityMap = styled('div')`
    ${styles}
`;

// caching previous state sends
let prevPlayerJSON: string | undefined;
let prevPlayersJSON: string | undefined;
let prevTilesJSON: string | undefined;
let prevBuildingsJSON: string | undefined;
let prevSelectionJSON: string | undefined;

// controling how we chunk up the state JSON
const CHUNK_TILES = 50;
const CHUNK_PLAYERS = 100;
const CHUNK_BUILDINGS = 50;

// queue of state to send
let isSending = false;
let gSendMessage: any;
let pendingPlayer: any;
let pendingPlayers: any;
let pendingTiles: any;
let pendingBuildings: any;
let pendingBlock: any;
let pendingSelection: any;

export const UnityMap: FunctionComponent<UnityMapProps> = ({
    world,
    player,
    selection,
    ...otherProps
}: UnityMapProps) => {
    const { dispatch } = player || {};
    const game = { player, selected: selection, world };
    const { selectTiles, selectIntent: rawSelectIntent, selectSeeker } = selection;
    const { unityProvider, sendMessage, addEventListener, removeEventListener, loadingProgression } = useUnityContext({
        loaderUrl: `/ds-unity/Build/ds-unity.loader.js`,
        dataUrl: `/ds-unity/Build/ds-unity.data`,
        frameworkUrl: `/ds-unity/Build/ds-unity.framework.js`,
        codeUrl: `/ds-unity/Build/ds-unity.wasm`,
        streamingAssetsUrl: `/ds-unity/StreamingAssets/`,
        companyName: `Playmint`,
        productName: `Downstream`,
        productVersion: `blueprint`
    });
    const [isReady, setIsReady] = useState(false);
    // We'll round the loading progression to a whole number to represent the
    // percentage of the Unity Application that has loaded.
    const loadingPercentage = Math.round(loadingProgression * 100);

    // We'll use a state to store the device pixel ratio.
    const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);

    useEffect(() => {
        // A function which will update the device pixel ratio of the Unity
        // Application to match the device pixel ratio of the browser.
        const updateDevicePixelRatio = function () {
            setDevicePixelRatio(window.devicePixelRatio);
        };
        // A media matcher which watches for changes in the device pixel ratio.
        const mediaMatcher = window.matchMedia(`screen and (resolution: ${devicePixelRatio}dppx)`);
        // Adding an event listener to the media matcher which will update the
        // device pixel ratio of the Unity Application when the device pixel
        // ratio changes.
        mediaMatcher.addEventListener('change', updateDevicePixelRatio);
        return function () {
            // Removing the event listener when the component unmounts.
            mediaMatcher.removeEventListener('change', updateDevicePixelRatio);
        };
    }, [devicePixelRatio]);

    // -- State update

    useEffect(() => {
        console.warn('setting up timer');
        const timer = setInterval(() => {
            if (isSending) {
                return;
            }
            if (!pendingPlayers && !pendingTiles && !pendingPlayer && !pendingSelection && !pendingBuildings) {
                return;
            }
            isSending = true;
            (async () => {
                try {
                    let args: any[] = [];

                    args.push([
                        'GameStateMediator',
                        'StartOnState',
                        JSON.stringify({ tiles: [], buildings: [], players: [], block: pendingBlock })
                    ]);

                    if (pendingPlayers) {
                        args = [...args, ...pendingPlayers];
                    }
                    if (pendingTiles) {
                        args = [...args, ...pendingTiles];
                    }
                    if (pendingBuildings) {
                        args = [...args, ...pendingBuildings];
                    }
                    if (pendingPlayer) {
                        args.push(pendingPlayer);
                    }
                    if (pendingSelection) {
                        args.push(pendingSelection);
                    }
                    args.push(['GameStateMediator', 'EndOnState']);

                    pendingPlayer = null;
                    pendingPlayers = null;
                    pendingTiles = null;
                    pendingBuildings = null;
                    pendingBlock = null;
                    pendingSelection = null;

                    for (let i = 0; i < args.length; i++) {
                        gSendMessage(...args[i]);
                        await sleep(0);
                    }
                } catch (err) {
                    console.error('SendMessage:', err);
                } finally {
                    isSending = false;
                }
            })();
        }, 25);
        return () => {
            console.warn('clearing timer');
            clearInterval(timer);
        };
    }, []);

    if (isReady && game.world) {
        gSendMessage = sendMessage;
        pendingBlock = game.world.block;

        if (game.world.players) {
            const nextPlayersJSON = JSON.stringify(game.world.players);
            if (nextPlayersJSON != prevPlayersJSON) {
                pendingPlayers = [['GameStateMediator', 'ResetWorldPlayers']];
                for (let i = 0; i < game.world.players.length; i += CHUNK_PLAYERS) {
                    pendingPlayers.push([
                        'GameStateMediator',
                        'AddWorldPlayers',
                        JSON.stringify(game.world.players.slice(i, i + CHUNK_PLAYERS))
                    ]);
                }
                prevPlayerJSON = nextPlayersJSON;
            }
        }

        if (game.world.tiles) {
            const nextTilesJSON = JSON.stringify(game.world.tiles);
            if (nextTilesJSON != prevTilesJSON) {
                pendingTiles = [['GameStateMediator', 'ResetWorldTiles']];
                for (let i = 0; i < game.world.tiles.length; i += CHUNK_TILES) {
                    pendingTiles.push([
                        'GameStateMediator',
                        'AddWorldTiles',
                        JSON.stringify(game.world.tiles.slice(i, i + CHUNK_TILES))
                    ]);
                }
                prevTilesJSON = nextTilesJSON;
            }
        }

        if (game.world.buildings) {
            const nextBuildingsJSON = JSON.stringify(game.world.buildings);
            if (nextBuildingsJSON != prevBuildingsJSON) {
                pendingBuildings = [['GameStateMediator', 'ResetWorldBuildings']];
                for (let i = 0; i < game.world.buildings.length; i += CHUNK_BUILDINGS) {
                    pendingBuildings.push([
                        'GameStateMediator',
                        'AddWorldBuildings',
                        JSON.stringify(game.world.buildings.slice(i, i + CHUNK_BUILDINGS))
                    ]);
                }
                prevBuildingsJSON = nextBuildingsJSON;
            }
        }

        const nextPlayerJSON = JSON.stringify(game.player);
        if (nextPlayerJSON != prevPlayerJSON) {
            pendingPlayer = ['GameStateMediator', 'SetPlayer', nextPlayerJSON];
            prevPlayerJSON = nextPlayerJSON;
        }

        const nextSelectionJSON = JSON.stringify(game.selected);
        if (nextSelectionJSON != prevSelectionJSON) {
            pendingSelection = ['GameStateMediator', 'SetSelectionState', nextSelectionJSON];
            prevSelectionJSON = nextSelectionJSON;
        }
    }

    const selectIntent = useCallback(
        (intent: string | undefined, tileId?: string) => {
            selectTiles(tileId ? [tileId] : []);
            rawSelectIntent(intent);
        },
        [selectTiles, rawSelectIntent]
    );

    // -- Event handling

    useEffect(() => {
        if (!addEventListener || !removeEventListener) {
            return;
        }
        // Export this code so it's used both here and the bridge
        const processMessage = (msgJson: any) => {
            let msgObj: Message;
            try {
                msgObj = JSON.parse(msgJson) as Message;
            } catch (e) {
                console.error(e);
                return;
            }

            switch (msgObj.msg) {
                case 'dispatch': {
                    const { action, args } = msgObj as DispatchMessage;
                    if (!dispatch) {
                        console.warn('map attempted to dispatch when there was no player to dispatch with');
                        return;
                    }
                    dispatch({ name: action as ActionName, args });
                    break;
                }
                case 'selectTiles': {
                    const { tileIDs } = msgObj as SelectTileMessage;
                    selectTiles(tileIDs);
                    break;
                }
                case 'setIntent': {
                    const { intent } = msgObj as SetIntentMessage;
                    selectIntent(intent);
                    break;
                }
                case 'selectSeeker': {
                    const { seekerID } = msgObj as SetSeekerMessage;
                    selectSeeker(seekerID);
                    break;
                }
                default: {
                    console.warn('unhandled message from map:', msgObj);
                }
            }
        };

        const processReady = () => {
            setIsReady(true);
        };

        addEventListener('sendMessage', processMessage);
        addEventListener('unityReady', processReady);

        return () => {
            removeEventListener('sendMessage', processMessage);
            removeEventListener('unityReady', processReady);
        };
    }, [dispatch, selectTiles, selectIntent, addEventListener, removeEventListener, selectSeeker]);

    return (
        <StyledUnityMap {...otherProps}>
            {loadingPercentage < 100 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#030f25',
                        height: '30px',
                        width: '100%',
                        maxWidth: '300px',
                        textAlign: 'center',
                        color: '#fff',
                        borderRadius: '5px'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#143063',
                            height: '100%',
                            width: `${loadingPercentage}%`,
                            transition: 'width .3s',
                            borderRadius: '5px'
                        }}
                    />
                </div>
            )}
            <Unity unityProvider={unityProvider} devicePixelRatio={devicePixelRatio} />
        </StyledUnityMap>
    );
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
