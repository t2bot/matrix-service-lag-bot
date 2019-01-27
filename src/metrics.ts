import * as client from "prom-client";
import * as express from "express";
import config from "./config";
import { LogService } from "matrix-bot-sdk";

export const latencyMetric = new client.Summary({
    name: 't2b_service_latency',
    help: 'Service latency',
    labelNames: ['from', 'to'],
    //maxAgeSeconds: (config.monitoring.timeout * 2) / 1000,
    //ageBuckets: 30,
});

export const timeoutsMetric = new client.Gauge({
    name: 't2b_service_timeout',
    help: 'Service timeouts',
    labelNames: ['from', 'to'],
});

export const errorsMetric = new client.Gauge({
    name: 't2b_service_errors',
    help: 'Service errors',
    labelNames: ['from', 'to'],
});

const app = express();
app.get("/metrics", (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
});

LogService.info("metrics", "Metrics listening on port " + config.monitoring.port + " at /metrics");
app.listen(config.monitoring.port);
