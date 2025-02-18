export const waitingSagaEndEventName = 'SAGA_END';

export const forceExitTimeoutMs = 20 * 1000;

export const forceExitErrorText = [
    '\u001b[1m\u001b[31mWARNING:\x1b[0m Force exit from waiting sagas execution by timeout.',
    'Probably not all sagas finished on server side.',
    'Not executed TAKE or RACE action names pairs data:'
];
