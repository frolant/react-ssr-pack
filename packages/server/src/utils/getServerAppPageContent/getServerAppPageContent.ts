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

type TGetServerAppPageContent = (options: IGetServerAppPageContentOptions) => Promise<{
    responseCode: number;
    content: string;
}>;

const defaultResponseCode = 200;

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

    let responseCodeResult;
    let contentResult;

    const defaultLogData = {
        logLevel,
        startTime: compilationStartTime,
        message: `compilation on "${originalUrl}" return`
    };

    try {
        const {
            maxIterationsCount,
            executedIterationsCount,
            effectsFilePaths,
            responseCode = defaultResponseCode,
            headData,
            content
        } = await serverAppRender({
            url: originalUrl,
            reducers,
            sagas,
            app
        });

        const isSuccessResponseCode = responseCode === defaultResponseCode;
        contentResult = isSuccessResponseCode ? getServerAppHTML(headData, content) : htmlTemplate;
        responseCodeResult = responseCode;

        logExecution({
            ...defaultLogData,
            message: isSuccessResponseCode ? `compiled on "${originalUrl}"` : defaultLogData.message,
            ...(!isSuccessResponseCode && {
                errorCode: responseCode
            })
        });

        if (logLevel === logLevels.trace) {
            logTrace(executedIterationsCount, maxIterationsCount, effectsFilePaths);
        }
    } catch (errorData) {
        contentResult = htmlTemplate;

        logExecution({
            ...defaultLogData,
            errorData
        });
    }

    return {
        responseCode: responseCodeResult,
        content: contentResult
    };
};
