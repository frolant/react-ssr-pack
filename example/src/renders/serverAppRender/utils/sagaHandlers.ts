import { EventEmitter } from 'events';
import { effectTypes } from 'redux-saga/effects';

import debounce from './debounce';

type TGetSagaHandlers = () => {
    onSagaAction: ({ type, payload }: any) => void;
    waitSaga: () => Promise<void>;
};

const { RACE, TAKE, PUT } = effectTypes;
const waitingSagaEndEventName = 'SAGA_END';
const forceExitTimeoutMs = 20 * 1000;
const forceExitErrorText = [
    '\u001b[1m\u001b[31mWARNING:\x1b[0m Force exit from waiting sagas execution by timeout.',
    'Probably not all sagas finished on server side.',
    'Not executed TAKE or RACE action names pairs data:'
];

const logForceExitError = (queue: string[][]): void => {
    console.error(forceExitErrorText.join('\n'), '\n', queue);
};

export const getSagaHandlers: TGetSagaHandlers = () => {
    let waitingActionsQueue: string[][] = [];
    let isWaitingSagaStarted = false;

    const waitingSagaEvents = new EventEmitter();

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

    return {
        onSagaAction: ({ type, payload }) => {
            if (type === RACE) {
                const actionTypes = Object.values(payload).map((item: any) => item.payload?.pattern || item).filter(Boolean);
                addToWaitingActionsQueue(actionTypes);
            }

            if (type === TAKE) {
                const actionTypes = payload.pattern.toString().split(',').filter(Boolean);
                addToWaitingActionsQueue(actionTypes);
            }

            if (type === PUT) {
                const actionType = payload.action.type;
                removeFromWaitingActionsQueue(actionType);
            }
        },
        waitSaga: async () => new Promise<void>((resolve) => {
            if (waitingActionsQueue.length) {
                isWaitingSagaStarted = true;

                const forceExitTimeout = setTimeout(() => {
                    logForceExitError(waitingActionsQueue);
                    fireEndWaiting();
                }, forceExitTimeoutMs);

                waitingSagaEvents.on(waitingSagaEndEventName, () => {
                    clearTimeout(forceExitTimeout);
                    resolve();
                });
            } else {
                resolve();
            }
        })
    };
};
