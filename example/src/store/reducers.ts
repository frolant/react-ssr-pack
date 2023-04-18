import { handleActions } from 'redux-actions';
import { ReducersMapObject } from 'redux';

import { requestError, requestProcess, requestSuccess, loadMenuSuccess, loadPageSuccess } from './actions';

import type { Action } from 'redux-actions';
import type { IRequest, IRootReducer } from './types';
import { IContent, IMenuItem, IPage } from './types';

const initialState: IRootReducer = {
    request: {
        process: false,
        error: null
    },
    content: {
        menu: null,
        pages: {}
    }
};

const request = handleActions<IRequest, string>({
    [requestProcess.toString()]: (state) => ({
        ...state,
        ...initialState.request,
        process: true
    }),
    [requestSuccess.toString()]: (state) => ({
        ...state,
        process: false
    }),
    [requestError.toString()]: (state, { payload }) => ({
        ...state,
        process: false,
        error: payload
    })
}, initialState.request);

const content = handleActions<IContent, IPage | IMenuItem[]>({
    [loadMenuSuccess.toString()]: (state, { payload }: Action<any>) => ({
        ...state,
        menu: payload
    }),
    [loadPageSuccess.toString()]: (state, { payload }: Action<any>) => ({
        ...state,
        pages: {
            ...state.pages,
            [payload.id]: payload.data
        }
    })
}, initialState.content);

export const reducers: ReducersMapObject<IRootReducer, any> = {
    request,
    content
};
