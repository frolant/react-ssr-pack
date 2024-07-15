import { logExecution, logLevels, logTrace } from '../logger';

import { getServerAppHTML, htmlTemplate, getRequestData } from './utils';

import stateCacheService from '../../services/stateCacheService';

import type { TLogLevels } from '../logger';
import type { TRenderAppConfig, TServerAppRender } from '../../types';

interface IGetServerAppPageContentOptions {
    serverAppRender: TServerAppRender<Record<string, unknown>>;
    appConfig: TRenderAppConfig;
    logLevel: TLogLevels;
    request: any;
}

type TGetServerAppPageContent = (options: IGetServerAppPageContentOptions) => Promise<{
    responseLocation: string;
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

    let responseLocationResult;
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
            responseLocation,
            content,
            head,
            state
        } = await serverAppRender({
            app,
            request: getRequestData(request),
            ...restAppConfig
        });

        const isSuccessResponseCode = responseCode === defaultResponseCode;
        contentResult = isSuccessResponseCode ? getServerAppHTML(originalUrl, head, content) : htmlTemplate;
        responseLocationResult = responseLocation;
        responseCodeResult = responseCode;

        isSuccessResponseCode && stateCacheService.createItem(originalUrl, state);

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
    } catch (errorData: any) {
        contentResult = htmlTemplate;

        logExecution({
            ...defaultLogData,
            errorData
        });
    }

    return {
        responseLocation: responseLocationResult,
        responseCode: responseCodeResult,
        content: contentResult
    };
};
