import { logMessage, logError } from './handlers';
import { logLevels, executionMessageParts, startServerListeningMessage } from './constants';

import type { TLogLevels } from './constants';

type TGetIsNeedLogging = (logLevel: TLogLevels, message: string, error: string) => boolean;
type TGetLogMessage = (logLevel: TLogLevels, startTime: number, message: string, error: string) => string;
type TLogExecution = (logLevel: TLogLevels, startTime: number, message: string, error?: string) => void;

const defaultLogLevel = logLevels.critical;

export const getIsNeedLogging: TGetIsNeedLogging = (logLevel, message, error) => {
    return !!error || logLevel !== logLevels.critical || message === startServerListeningMessage;
};

export const getLogMessage: TGetLogMessage = (logLevel, startTime, message, error) => {
    const time = new Date();
    const status = error ? executionMessageParts.error : executionMessageParts.success;
    const executionTime = time.getTime() - startTime;
    const messagePrefix = logLevel === logLevels.debug ? `${time} ` : '';

    return `${messagePrefix}${executionMessageParts.title} ${message} ${status} in ${executionTime} ms`;
};

export const logExecution: TLogExecution = (logLevel = defaultLogLevel, startTime, message = '', error = null) => {
    const isNeedLogging = getIsNeedLogging(logLevel, message, error);

    if (isNeedLogging) {
        const messageText = getLogMessage(logLevel, startTime, message, error);
        logMessage(messageText);

        if (error) {
            logError(error);
        }
    }
};
