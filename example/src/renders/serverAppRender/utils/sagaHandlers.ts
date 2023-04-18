import { EventEmitter } from 'events';
import { effectTypes } from 'redux-saga/effects';

import debounce from './debounce';

const forceExitErrorText = [
    '\u001b[1m\u001b[31mWARNING:\x1b[0m Force exit from waiting sagas execution by timeout.',
    'Probably not all sagas finished on server side.',
    'Not executed TAKE or RACE action names pairs data:'
];

const waitingSagaEvents = new EventEmitter();
const waitingSagaEndEventName = 'SAGA_END';
const { RACE, TAKE, PUT } = effectTypes;

let waitingActionsQueue: string[][] = [];
let isWaitingSagaStarted = false;

const logForceExitError = (): void => {
    console.error(forceExitErrorText.join('\n'), '\n', waitingActionsQueue);
};

const fireEndWaiting = (): void => {
    isWaitingSagaStarted = false;
    waitingActionsQueue = [];
    waitingSagaEvents.emit(waitingSagaEndEventName);
};

const debouncedProcessEndWaiting = debounce(() => {
    if (isWaitingSagaStarted && !waitingActionsQueue.length) {
        fireEndWaiting();
    }
}, 100);

const addToWaitingActionsQueue = (actionTypes: string[] = []): void => {
    if (actionTypes.length > 1) {
        waitingActionsQueue.push(actionTypes);
    }
};

const removeFromWaitingActionsQueue = (actionType: string): void => {
    waitingActionsQueue = waitingActionsQueue.filter((item) => !item.includes(actionType));
    debouncedProcessEndWaiting();
};

export const onSagaAction = ({ type, payload }: any): void => {
    if (type === RACE) {
        const actionTypes = Object.values(payload).map((item: any) => item.payload?.pattern || item);
        addToWaitingActionsQueue(actionTypes);
    }

    if (type === TAKE) {
        const actionTypes = payload.pattern.toString().split(',');
        addToWaitingActionsQueue(actionTypes);
    }

    if (type === PUT) {
        const actionType = payload.action.type;
        removeFromWaitingActionsQueue(actionType);
    }
};

export const waitSaga = async (): Promise<void> => new Promise<void>((resolve) => {
    if (waitingActionsQueue.length) {
        isWaitingSagaStarted = true;

        const forceExitTimeout = setTimeout(() => {
            logForceExitError();
            fireEndWaiting();
        }, 6000);

        waitingSagaEvents.on(waitingSagaEndEventName, () => {
            clearTimeout(forceExitTimeout);
            resolve();
        });
    } else {
        resolve();
    }
});
