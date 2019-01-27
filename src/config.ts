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
    monitoring: {
        interval: number;
        timeout: number;
    };
}

export default <BotConfig>config;
