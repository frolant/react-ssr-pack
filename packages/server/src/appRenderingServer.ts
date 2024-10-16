import express from 'express';
import { resolve } from 'path';

import createDefaultStateCacheService from './services/stateCacheService';

import { logExecution, startServerListeningMessage } from './utils/logger';
import createGetServerAppPageContentHandler from './utils/getServerAppPageContent';
import createGetServerAppStateHandler from './utils/getServerAppState';

import { staticRelativePath, stateAddressPart } from './constants';

import type { Express } from 'express';
import type { TLogLevels } from './utils/logger';
import type { TServerAppRender, TRenderAppConfig, IStateCacheService } from './types';

export interface IRunAppServerOptions {
    serverAppRender: TServerAppRender<Record<string, unknown>>;
    appConfig: TRenderAppConfig;
    logLevel: TLogLevels;
    port: number;
    onServerInitialization?: (server: Express) => void;
    stateCacheService?: IStateCacheService;
}

type TRunAppServer = (options: IRunAppServerOptions) => void;

const runAppServer: TRunAppServer = ({
    serverAppRender,
    appConfig,
    port,
    logLevel,
    onServerInitialization,
    stateCacheService
}): void => {
    const startTime = new Date().getTime();
    const cacheService = stateCacheService || createDefaultStateCacheService();
    const staticPath = resolve(__dirname, staticRelativePath);

    const getServerAppState = createGetServerAppStateHandler(cacheService);
    const getServerAppPageContent = createGetServerAppPageContentHandler(cacheService);
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

    server.get(`${stateAddressPart}*`, async (request, response) => {
        const stateData = await getServerAppState(request);
        return response.send(stateData);
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
