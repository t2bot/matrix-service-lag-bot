export interface IService {
    readonly name: string;

    readonly oneWay: boolean;

    waitForMessage(targetReference: any, content: string): Promise<any>;

    sendMessage(targetReference: any, content: string): Promise<any>;
}
