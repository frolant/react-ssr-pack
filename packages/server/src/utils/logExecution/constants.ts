interface ILogLevels {
    development: TLogLevels;
    critical: TLogLevels;
    trace: TLogLevels;
    debug: TLogLevels;
}

export type TLogLevels = keyof typeof logLevels;

export const logLevels: ILogLevels = {
    development: 'development',
    critical: 'critical',
    trace: 'trace',
    debug: 'debug'
};

export const startServerListeningMessage = 'listening';

const messageStyle = {
    drop: '\x1b[0m',
    bold: '\u001b[1m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001B[33m',
    blue: '\u001B[36m'
};

export const executionMessageParts = {
    title: 'ssr',
    error: (postfix: string) => `error${postfix}`,
    success: 'successfully'
};

export const coloredExecutionMessageParts = {
    title: `${messageStyle.bold}${executionMessageParts.title}${messageStyle.drop}`,
    error: (postfix: string) => `${messageStyle.bold}${messageStyle.red}${executionMessageParts.error(postfix)}${messageStyle.drop}`,
    success: `${messageStyle.green}${messageStyle.bold}${executionMessageParts.success}${messageStyle.drop}`
};

export const traceMessageParts = {
    index: messageStyle.yellow,
    iterations: `${messageStyle.blue}iterations count:${messageStyle.drop} ${messageStyle.bold}`,
    effects: `${messageStyle.blue}executed effects count:${messageStyle.drop} ${messageStyle.bold}`,
    styleEnd: messageStyle.drop
};
