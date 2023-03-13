import {
    DawnseekersClient,
    State,
    PluginTrust,
    PluginType,
} from "./ds-client/host";
import fetch from "cross-fetch";
import WebSocket from "ws";
import { Observer } from "zen-observable-ts";

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

class DawnSeekersBridge implements Observer<State> {
    private _ds: DawnseekersClient;

    constructor(privKey: string) {
        this._ds = new DawnseekersClient({
            wsEndpoint: "ws://localhost:8080/query",
            httpEndpoint: "http://localhost:8080/query",
            autoloadablePlugins: [
                // this would be fetched from cog-services
                {
                    type: PluginType.BUILDING,
                    trust: PluginTrust.UNTRUSTED,
                    addr: "my-building-kind-addr",
                    src: ``,
                },
            ],
            corePlugins: [],
            fetch,
            webSocketImpl: WebSocket,
            privKey,
        });

        this._ds.subscribe(this);

        this.signin();

        process.stdin.on("data", (data: Buffer) => {
            const json = data.toString("utf-8");
            try {
                const msgObj = JSON.parse(json) as Message;
                if (msgObj.msg === "dispatch") {
                    const { action, args } = msgObj as DispatchMessage;
                    this._ds.dispatch(action, ...args);
                }
                if (msgObj.msg === "selectTiles") {
                    const { tileIDs } = msgObj as SelectTileMessage;
                    this._ds.selectTiles(tileIDs);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    private async signin() {
        await this._ds.signin();
    }

    public next(state: State) {
        state = this.breakCircularReferences(state) as State;

        const json = JSON.stringify(state, (key, value) => {
            if (typeof value === "bigint") {
                return BigInt(value).toString(16);
            }
            return value;
        });

        process.stdout.write(json + "\n");
    }

    private breakCircularReferences(obj: any, ancestorSet?: any[]) {
        const seen: any[] = [];
        if (ancestorSet) {
            seen.push(...ancestorSet);
        }

        if (seen.indexOf(obj) > -1) {
            const idx = seen.indexOf(obj);
            return null;
        }

        seen.push(obj);

        const newObj = Array.isArray(obj) ? [] : {};

        for (var key in obj) {
            const value = obj[key];
            if (typeof value === "object" && value !== null) {
                const newVal = this.breakCircularReferences(value, seen);
                if (newVal !== null) {
                    newObj[key] = newVal;
                }
            } else {
                newObj[key] = obj[key];
            }
        }

        return newObj;
    }

    // private simpleBreakCircularReferences(obj: any) {
    //     for (let key in obj) {
    //         obj[key] = JSON.parse(
    //             JSON.stringify(obj[key], this.getCircularReplacer())
    //         );
    //     }

    //     return obj;
    // }

    // private getCircularReplacer() {
    //     const seen = new WeakSet();
    //     return (key, value) => {
    //         if (typeof value === "bigint") {
    //             return BigInt(value).toString(16);
    //         }

    //         if (typeof value === "object" && value !== null) {
    //             if (seen.has(value)) {
    //                 return;
    //             }
    //             seen.add(value);
    //         }

    //         return value;
    //     };
    // }
}

const DEFAULT_PRIV_KEY =
    "0xc14c1284a5ff47ce38e2ad7a50ff89d55ca360b02cdf3756cdb457389b1da223";
const privKey = process.argv.length >= 3 ? process.argv[2] : DEFAULT_PRIV_KEY;

const bridge = new DawnSeekersBridge(privKey);