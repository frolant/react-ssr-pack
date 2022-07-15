import { logExecution, logLevels, logTrace } from '../logExecution';

import { getServerAppHTML, htmlTemplate } from './getServerAppHTML';

import type { TLogLevels } from '../logExecution';
import type { IRenderAppConfig, TServerAppRender } from '../../types';

interface IGetServerAppPageContentOptions {
    serverAppRender: TServerAppRender;
    appConfig: IRenderAppConfig;
    logLevel: TLogLevels;
    request: any;
}

type TGetServerAppPageContent = (options: IGetServerAppPageContentOptions) => Promise<string>;

export const getServerAppPageContent: TGetServerAppPageContent = async ({
    serverAppRender,
    appConfig: {
        reducers,
        sagas,
        app
    },
    logLevel,
    request
}) => {
    const compilationStartTime = new Date().getTime();
    const { originalUrl } = request;
    let result;

    try {
        const { maxIterationsCount, executedIterationsCount, effectsFilePaths, headData, content } = await serverAppRender({
            url: originalUrl,
            reducers,
            sagas,
            app
        });

        result = getServerAppHTML(headData, content);

        logExecution(logLevel, compilationStartTime, `compiled on "${originalUrl}"`);

        if (logLevel === logLevels.trace) {
            logTrace(executedIterationsCount, maxIterationsCount, effectsFilePaths);
        }
    } catch (error) {
        result = htmlTemplate;

        logExecution(logLevel, compilationStartTime, `compilation on "${originalUrl}" return`, error);
    }

    return result;
};
