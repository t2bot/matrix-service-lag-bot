import { MatrixService } from "./matrix/MatrixService";
import { LogService } from "matrix-bot-sdk";
import config from "./config";
import { DiscordService } from "./discord/DiscordService";
import { ServiceWatcher } from "./ServiceWatcher";
import { TelegramService } from "./telegram/TelegramService";

LogService.info("index", "Creating services...");
const matrix = new MatrixService();

const watchers = [];

if (config.discord.enabled) {
    const discord = new DiscordService();
    watchers.push(new ServiceWatcher(matrix, discord, config.discord.roomId, config.discord.channelId));
}

if (config.telegram.enabled) {
    const telegram = new TelegramService();
    watchers.push(new ServiceWatcher(matrix, telegram, config.telegram.roomId, config.telegram.channelId));
}

LogService.info("index", `Watchers started: ${watchers.length}`);
