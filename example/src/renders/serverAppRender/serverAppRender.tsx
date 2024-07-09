import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { END } from 'redux-saga';
import { nodeAppRender } from '@react-ssr-pack/tools';

import AppInitializationContainer from 'components/AppInitializationContainer';
import { HeadDataSwitchContainerProvider } from 'components/HeadDataSwitchContainer';

import { initStore } from 'services/storeService';

import { getProcessedRenderingResultData, onSagaAction, waitSaga } from './utils';

import type { StaticRouterContext as IRouterContext } from 'react-router';
import type { TServerAppRender } from '@react-ssr-pack/server';
import type { IHeadDataSwitchContainerContext } from 'components/HeadDataSwitchContainer';
import type { IRenderOptionsExtension } from '../types';

const serverAppRender: TServerAppRender<IRenderOptionsExtension> = async ({
    app: AppComponent,
    request,
    reducers,
    sagas
}) => {
    const routerContext: IRouterContext = {};
    const headDataContext = {} as IHeadDataSwitchContainerContext;

    let { store, saga } = initStore(reducers, sagas, {} as any, onSagaAction);

    const onRenderedHandler = async (): Promise<void> => {
        await waitSaga();

        store.dispatch(END);

        await saga.toPromise();

        const prevStore = store.getState();
        const { store: nextStore, saga: nextSaga } = initStore(reducers, sagas, prevStore, onSagaAction);

        store = nextStore;
        saga = nextSaga;
    };

    const renderingResult = await nodeAppRender(() => (
        <HeadDataSwitchContainerProvider context={headDataContext}>
            <StaticRouter
                location={request.url}
                context={routerContext}
            >
                <Provider store={store}>
                    <AppInitializationContainer>
                        <AppComponent />
                    </AppInitializationContainer>
                </Provider>
            </StaticRouter>
        </HeadDataSwitchContainerProvider>
    ), onRenderedHandler);

    return getProcessedRenderingResultData({
        initialState: store.getState(),
        renderingResult,
        headDataContext,
        routerContext
    });
};

export default serverAppRender;
