import { IService } from "../IService";
import { MatrixService } from "../matrix/MatrixService";

export class BotService implements IService {
    private waiting: (() => void)[] = [];

    public constructor(
        private targetUserId: string,
        private responseRegex: RegExp,
        private command: string,
        private matrixService: MatrixService,
    ) {
        this.matrixService.bot.on("room.message", this.onMessage.bind(this));
    }

    public get name(): string {
        return `bot-${this.targetUserId}`;
    }

    public get oneWay(): boolean {
        return true;
    }

    private onMessage(roomId, event) {
        const body = event!.content!.body;
        const sender = event!.sender!;
        if (this.responseRegex.test(body || "") && sender === this.targetUserId) {
            this.waiting.forEach(fn => fn());
            this.waiting = [];
        }
    }

    public sendMessage(targetReference: any, content: string): Promise<any> {
        return this.matrixService.bot.sendText(targetReference, this.command);
    }

    public waitForMessage(targetReference: any, content: string): Promise<any> {
        return new Promise<void>((resolve, _) => {
            this.waiting.push(resolve);
        });
    }
}
