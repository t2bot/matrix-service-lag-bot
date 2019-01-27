import { MatrixService } from "./matrix/MatrixService";
import { IService } from "./IService";
import config from "./config";
import { timeout, TimeoutError } from 'promise-timeout';
import { LogService } from "matrix-bot-sdk";
import * as uuidv4 from "uuid/v4";

export class ServiceWatcher {
    constructor(private matrix: MatrixService, private monitoredService: IService, private roomId: string, private targetRef: any) {
        setInterval(this.checkLag.bind(this), config.monitoring.interval);
    }

    private async checkLag() {
        // Matrix -> Remote
        LogService.info("ServiceWatcher", `Testing ${this.matrix.name}->${this.monitoredService.name}`);
        try {
            const val = uuidv4();
            await this.matrix.sendMessage(this.roomId, val);
            const now = new Date().getTime();
            await timeout(this.monitoredService.waitForMessage(this.targetRef, val), config.monitoring.timeout);
            const tts = (new Date().getTime()) - now;
            LogService.info("ServiceWatcher", `${this.matrix.name}->${this.monitoredService.name}: ${tts}ms`);
        } catch (e) {
            if (e instanceof TimeoutError) {
                LogService.warn("ServiceWatcher", `Timeout: ${this.matrix.name}->${this.monitoredService.name}`);
            } else {
                LogService.error("ServiceWatcher", `Failure: ${this.matrix.name}->${this.monitoredService.name}`, e);
            }
        }

        // Remote -> Matrix
        LogService.info("ServiceWatcher", `Testing ${this.monitoredService.name}->${this.matrix.name}`);
        try {
            const val = uuidv4();
            await this.monitoredService.sendMessage(this.targetRef, val);
            const now = new Date().getTime();
            await timeout(this.matrix.waitForMessage(this.targetRef, val), config.monitoring.timeout);
            const tts = (new Date().getTime()) - now;
            LogService.info("ServiceWatcher", `${this.monitoredService.name}->${this.matrix.name}: ${tts}ms`);
        } catch (e) {
            if (e instanceof TimeoutError) {
                LogService.warn("ServiceWatcher", `Timeout: ${this.monitoredService.name}->${this.matrix.name}`);
            } else {
                LogService.error("ServiceWatcher", `Failure: ${this.monitoredService.name}->${this.matrix.name}`, e);
            }
        }
    }
}