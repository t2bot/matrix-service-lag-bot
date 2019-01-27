import { IService } from "../IService";
import { LogService, MatrixClient } from "matrix-bot-sdk";
import config from "../config";

export class MatrixService implements IService {

    private bot: MatrixClient;
    private waiting: { [msgid: string]: () => void } = {};

    constructor() {
        this.bot = new MatrixClient(config.matrix.primary.homeserverUrl, config.matrix.primary.accessToken);
        this.bot.on("room.message", this.onMessage.bind(this));
        this.bot.start().then(() => LogService.info("MatrixService", "Bot started!"));
    }

    public get name(): string {
        return "matrix";
    }

    private onMessage(roomId, event) {
        const body = event!.content!.body;
        if (this.waiting[body]) {
            this.waiting[body](); // resolve
            delete this.waiting[body];
        }
    }

    public sendMessage(targetReference: any, content: string): Promise<any> {
        return this.bot.sendMessage(targetReference, {msgtype: "m.text", body: content});
    }

    public waitForMessage(targetReference: any, content: string): Promise<any> {
        return new Promise((resolve, _) => {
            this.waiting[content] = resolve;
        });
    }
}