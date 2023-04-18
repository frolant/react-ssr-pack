import { put, call, take, race, takeEvery } from 'redux-saga/effects';

import request from 'utils/request';
import log from 'utils/log';

import { requestError, requestProcess, requestSuccess, loadMenuRequest, loadMenuSuccess, loadPageRequest, loadPageSuccess } from './actions';

import type { Action } from 'redux';
import type { IPage } from './types';

interface IRequestPayload {
    payload: {
        dataId: string;
        onLoadAction: (payload: any) => Action;
    };
    type: string;
}

// All console.log on this file,
// just for tests execution call, take, race and put
// saga effects on server side if run 'app:hot:debug' command.

function* processRequest({ payload: { dataId, onLoadAction } }: IRequestPayload): Generator<any, void, any> {
    try {
        log(`saga action ${requestProcess.toString()} execution for dataId ${dataId} start`);
        const data = yield call(request, `/data/${dataId}.json`);
        log(`saga action ${requestProcess.toString()} execution for dataId ${dataId} end`);

        yield put(onLoadAction(data));
        yield put(requestSuccess());
    } catch (error: any) {
        yield put(requestError(error));
    }
}

function* processLoadMenu(): Generator<any, void, any> {
    yield put(requestProcess({
        dataId: 'menu',
        onLoadAction: loadMenuSuccess
    }));

    // Test TAKE saga effect
    yield take([
        loadMenuSuccess.toString(),
        requestError.toString()
    ]);

    log(`saga TAKE effect with action ${loadMenuSuccess.toString()} executed`);
}

function* processLoadPage({ payload: dataId }: IRequestPayload): Generator<any, void, any> {
    yield put(requestProcess({
        dataId,
        onLoadAction: (data: IPage) => loadPageSuccess({
            id: dataId,
            data
        })
    }));

    // Test RACE saga effect
    const {
        success,
        failure
    } = yield race({
        success: loadPageSuccess.toString(),
        failure: requestError.toString()
    });

    log(`saga RACE effect with action ${success || failure} executed`);
}

function* Request(): Generator {
    yield takeEvery(requestProcess.toString(), processRequest);
}

function* Content(): Generator {
    yield takeEvery(loadMenuRequest.toString(), processLoadMenu);
    yield takeEvery(loadPageRequest.toString(), processLoadPage);
}

export const sagas = [
    Request,
    Content
];
