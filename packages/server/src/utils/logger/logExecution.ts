import { logMessage, logError } from './handlers';
import { logLevels, executionMessageParts, coloredExecutionMessageParts, startServerListeningMessage } from './constants';

import type { TLogLevels } from './constants';

interface ITLogExecutionOptions {
    logLevel: TLogLevels;
    startTime: number;
    message: string;
    errorData?: string;
    errorCode?: number;
}

type TGetIsNeedLogging = (logLevel: TLogLevels, message: string, errorData: string) => boolean;
type TGetLogMessage = (logLevel: TLogLevels, startTime: number, message: string, errorData: string, errorCode: number) => string;
type TLogExecution = (options: ITLogExecutionOptions) => void;

const defaultLogLevel = logLevels.critical;

export const getIsNeedLogging: TGetIsNeedLogging = (logLevel, message, errorData) => {
    return !!errorData || logLevel !== logLevels.critical || message === startServerListeningMessage;
};

export const getLogMessage: TGetLogMessage = (logLevel, startTime, message, errorData, errorCode) => {
    const time = new Date();

    const isNeedColoredMessage = logLevel === logLevels.development || logLevel === logLevels.trace;
    const messageParts = isNeedColoredMessage ? coloredExecutionMessageParts : executionMessageParts;

    const messagePrefix = logLevel === logLevels.debug ? `${time} ` : '';
    const codeInfo = errorCode ? ` code ${errorCode}` : '';
    const status = errorData || errorCode ? messageParts.error(codeInfo) : messageParts.success;
    const executionTime = time.getTime() - startTime;

    return `${messagePrefix}${messageParts.title} ${message} ${status} in ${executionTime} ms`;
};

export const logExecution: TLogExecution = (options) => {
    const { logLevel = defaultLogLevel, startTime, message = '', errorData = null, errorCode = null } = options;
    const isNeedLogging = getIsNeedLogging(logLevel, message, errorData);

    if (isNeedLogging) {
        const messageText = getLogMessage(logLevel, startTime, message, errorData, errorCode);
        logMessage(messageText);

        if (errorData) {
            logError(errorData);
        }
    }
};
