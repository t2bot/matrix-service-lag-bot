import { IService } from "../IService";
import { Client } from "matrix-org-irc";
import { LogService } from "matrix-bot-sdk";
import config from "../config";

export class IRCService implements IService {

    private client: Client;
    private waiting: { [messageText: string]: () => void } = {};

    constructor() {
        this.client = new Client(config.irc.host, config.irc.nick, {
            port: config.irc.port,
            secure: config.irc.ssl,
            autoConnect: false,
            autoRejoin: true,
        });
        this.client.on('registered', () => LogService.info("IRCService", "Bot ready"));
        this.client.on('message', this.onIRCMessage.bind(this));
        this.client.connect(5, () => {
            LogService.info("IRCService", "Bot connected");
            this.client.join(config.irc.channel).then(() => {
                LogService.info("IRCService", `Bot joined to ${config.irc.channel}`);
            });
        });
    }

    public get name(): string {
        return "irc";
    }

    private onIRCMessage(from: string, to: string, body: string) {
        if (to !== config.irc.channel) {
            // Only handle messages to the channel we expect.
            return;
        }
        if (this.waiting[body]) {
            this.waiting[body]();
            delete this.waiting[body];
        }
    }

    public async sendMessage(targetReference: any, content: string): Promise<void> {
        await this.client.say(config.irc.channel, content);
    }

    public waitForMessage(targetReference: any, content: string): Promise<void> {
        return new Promise((resolve, _) => {
            this.waiting[content] = resolve;
        });
    }
}