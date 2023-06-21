import express from 'express';
import { resolve } from 'path';

import { getServerAppPageContent } from './utils/getServerAppPageContent';

import { logExecution, startServerListeningMessage } from './utils/logger';

import type { Express } from 'express';
import type { TLogLevels } from './utils/logger';
import type { TServerAppRender, TRenderAppConfig } from './types';

export interface IRunAppServerOptions {
    serverAppRender: TServerAppRender<Record<string, unknown>>;
    appConfig: TRenderAppConfig;
    logLevel: TLogLevels;
    port: number;
    onServerInitialization?: (server: Express) => void;
}

type TRunAppServer = (options: IRunAppServerOptions) => void;

const staticRelativePath = '../client';

const runAppServer: TRunAppServer = ({
    serverAppRender,
    appConfig,
    port,
    logLevel,
    onServerInitialization
}): void => {
    const startTime = new Date().getTime();
    const staticPath = resolve(__dirname, staticRelativePath);
    const server = express();

    if (onServerInitialization) {
        onServerInitialization(server);
    }

    server.use(express.static(staticPath, {
        index: false
    }));

    server.get('/check-server-availability', async (_, response) => {
        return response.send();
    });

    server.get('/*', async (request, response) => {
        const { responseCode, responseLocation, content } = await getServerAppPageContent({
            logLevel,
            serverAppRender,
            appConfig,
            request
        });

        if (responseLocation) {
            response.location(responseLocation);
        }

        return response.status(responseCode).send(content);
    });

    server.listen(port, () => logExecution({
        message: startServerListeningMessage,
        startTime,
        logLevel
    }));
};

export default runAppServer;
