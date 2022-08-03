import express from 'express';
import { resolve } from 'path';

import { initializePrometheusClient } from './utils/initializePrometheusClient';
import { getServerAppPageContent } from './utils/getServerAppPageContent';

import { logExecution, startServerListeningMessage } from './utils/logExecution';

import type { TLogLevels } from './utils/logExecution';
import type { TServerAppRender, IRenderAppConfig } from './types';

interface TRunAppServerOptions {
    serverAppRender: TServerAppRender;
    appConfig: IRenderAppConfig;
    useMetrics: boolean;
    logLevel: TLogLevels;
    port: number;
}

type TRunAppServer = (options: TRunAppServerOptions) => void;

const staticRelativePath = '../client';

const runAppServer: TRunAppServer = ({ serverAppRender, appConfig, port, logLevel, useMetrics }): void => {
    const startTime = new Date().getTime();
    const staticPath = resolve(__dirname, staticRelativePath);
    const app = express();

    if (useMetrics) {
        const prometheusClient = initializePrometheusClient();

        app.get('/metrics', async (_request, response) => {
            return response.send(await prometheusClient.metrics());
        });
    }

    app.use(express.static(staticPath, {
        index: false
    }));

    app.get('/*', async (request, response) => {
        const { responseCode, content } = await getServerAppPageContent({
            logLevel,
            serverAppRender,
            appConfig,
            request
        });

        return response.status(responseCode).send(content);
    });

    app.listen(port, () => logExecution({
        logLevel,
        startTime,
        message: startServerListeningMessage
    }));
};

export default runAppServer;
