import { MatrixService } from "./matrix/MatrixService";
import { LogService } from "matrix-bot-sdk";
import config from "./config";
import { DiscordService } from "./discord/DiscordService";
import { ServiceWatcher } from "./ServiceWatcher";

LogService.info("index", "Creating services...");
const matrix = new MatrixService();

const watchers = [];

if (config.discord.enabled) {
    const discord = new DiscordService();
    watchers.push(new ServiceWatcher(matrix, discord, config.discord.roomId, null));
}

LogService.info("index", `Watchers started: ${watchers.length}`);
