import { IService } from "../IService";
import Telegraf, { ContextMessageUpdate, Telegram } from "telegraf";
import config from "../config";
import { LogService } from "matrix-bot-sdk";

export class TelegramService implements IService {

    private bot: any;
    private waiting: { [msgid: string]: () => void } = {};

    constructor() {
        this.bot = new Telegraf(config.telegram.botToken);
        this.bot.on('text', this.onMessage.bind(this));
        this.bot.launch().then(() => LogService.info("TelegramService", "Bot started!"));
    }

    public get name(): string {
        return "telegram";
    }

    private onMessage(context: ContextMessageUpdate) {
        if (context.message!.chat!.id !== config.telegram.channelId) return;

        const body = context.message!.text;
        if (this.waiting[body]) {
            this.waiting[body](); // resolve
            delete this.waiting[body];
        }
    }

    public sendMessage(targetReference: any, content: string): Promise<any> {
        return this.bot.telegram.sendMessage(targetReference, content);
    }

    public waitForMessage(targetReference: any, content: string): Promise<any> {
        return new Promise((resolve, _) => {
            this.waiting[content] = resolve;
        });
    }

}