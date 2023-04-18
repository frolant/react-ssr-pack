import { all, fork } from 'redux-saga/effects';
import { legacy_createStore as create, combineReducers, compose } from 'redux';

import { isRunInBrowser, window } from 'utils/window';

import type { TCreateRootSaga, TCreateStore, TStore } from './types';

export const createStore: TCreateStore = (reducers, middlewares, initialStore = {} as TStore) => {
    const isDevelopment = !__IS_PRODUCTION_MODE__;
    const extensions = isRunInBrowser ? window.__REDUX_DEVTOOLS_EXTENSION__ : () => {};

    const combinedReducer = combineReducers(reducers);
    const composedMiddlewares = compose(middlewares, isDevelopment && isRunInBrowser && extensions ? extensions() : (f: any) => f);

    return create(combinedReducer, initialStore, composedMiddlewares);
};

export const createRootSaga: TCreateRootSaga = (sagas) => function* rootSaga() {
    yield all(sagas.map(fork));
};
