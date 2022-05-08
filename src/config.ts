import * as config from "config";

export interface BotConfig {
    matrix: {
        primary: {
            homeserverUrl: string;
            accessToken: string;
        };
    };
    discord: {
        enabled: boolean;
        botToken: string;
        roomId: string;
        channelId: string;
    };
    telegram: {
        enabled: boolean;
        botToken: string;
        roomId: string;
        channelId: number;
    };
    monitoring: {
        interval: number;
        timeout: number;
        port: number;
    };
    irc: {
        enabled: boolean;
        roomId: string;
        host: string;
        port: number;
        ssl: boolean;
        nick: string;
        channel: string;
    };
    bots: {
        enabled: boolean;
        targets: {
            mxid: string;
            command: string;
            roomId: string;
            respRegex: string;
        }[];
    };
}

export default <BotConfig>config;
