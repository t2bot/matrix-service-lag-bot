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
    };
}

export default <BotConfig>config;
