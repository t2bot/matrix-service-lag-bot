import { IService } from "../IService";
import * as Discord from 'discord.js';
import { Client, Message, TextChannel } from 'discord.js';
import { LogService } from "matrix-bot-sdk";
import config from "../config";

export class DiscordService implements IService {

    private client: Client;
    private waiting: { [msgid: string]: () => void } = {};

    constructor() {
        this.client = new Discord.Client();
        this.client.on('ready', () => LogService.info("DiscordService", "Bot started!"));
        this.client.on('message', this.onMessage.bind(this));
        this.client.login(config.discord.botToken).then(() => LogService.info("DiscordService", "Bot logged in"));
    }

    public get name(): string {
        return "discord";
    }

    private onMessage(msg: Message) {
        const body = msg.content;
        if (this.waiting[body]) {
            this.waiting[body](); // resolve
            delete this.waiting[body];
        }
    }

    public sendMessage(targetReference: any, content: string): Promise<any> {
        const chan = <TextChannel>this.client.channels.get(targetReference);
        return chan.send(content);
    }

    public waitForMessage(targetReference: any, content: string): Promise<any> {
        return new Promise((resolve, _) => {
            this.waiting[content] = resolve;
        });
    }
}