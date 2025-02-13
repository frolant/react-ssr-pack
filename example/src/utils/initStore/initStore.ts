import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { getOnSagaActionMiddleware } from './middlewares';

import { createStore, createRootSaga } from './utils';

import type { TInitStore } from './types';

export const initStore: TInitStore = (reducers, sagas, initialStore, onSagaAction) => {
    const sagaMiddleware = createSagaMiddleware({
        ...(!__IS_PRODUCTION_MODE__ && {
            onError: (_, { sagaStack }) => console.log(sagaStack) // eslint-disable-line no-console
        }),
        ...(onSagaAction && {
            effectMiddlewares: [
                getOnSagaActionMiddleware(onSagaAction)
            ]
        })
    });

    const middlewares = applyMiddleware(sagaMiddleware);

    const store = createStore(reducers, middlewares, initialStore);
    const rootSaga = createRootSaga(sagas);

    return {
        saga: sagaMiddleware.run(rootSaga),
        store
    };
};
