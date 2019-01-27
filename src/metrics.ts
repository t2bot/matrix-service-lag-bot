import * as client from "prom-client";
import * as express from "express";
import config from "./config";
import { LogService } from "matrix-bot-sdk";

export const latencyMetric = new client.Histogram({
    name: 't2b_service_latency',
    help: 'Service latency',
    labelNames: ['from', 'to'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0]
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
