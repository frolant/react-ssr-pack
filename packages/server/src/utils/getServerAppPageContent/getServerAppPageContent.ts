import { logExecution, logLevels, logTrace } from '../logger';

import { getServerAppHTML, htmlTemplate } from './getServerAppHTML';

import type { TLogLevels } from '../logger';
import type { TRenderAppConfig, TServerAppRender } from '../../types';

interface IGetServerAppPageContentOptions {
    serverAppRender: TServerAppRender<Record<string, unknown>>;
    appConfig: TRenderAppConfig;
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
        app,
        ...restAppConfig
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
            content,
            head
        } = await serverAppRender({
            app,
            url: originalUrl,
            ...restAppConfig
        });

        const isSuccessResponseCode = responseCode === defaultResponseCode;
        contentResult = isSuccessResponseCode ? getServerAppHTML(head, content) : htmlTemplate;
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
