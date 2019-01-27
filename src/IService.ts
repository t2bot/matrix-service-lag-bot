export interface IService {
    readonly name: string;

    waitForMessage(targetReference: any, content: string): Promise<any>;

    sendMessage(targetReference: any, content: string): Promise<any>;
}