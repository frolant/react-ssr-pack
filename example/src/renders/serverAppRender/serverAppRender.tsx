import { StaticRouter } from 'react-router-dom';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { END } from 'redux-saga';
import { nodeAppRender } from '@react-ssr-pack/tools';
import { PortalsContextProvider, PortalsCollection } from '@react-ssr-pack/portal';
import { getReduxSagaHandlers } from '@react-ssr-pack/redux-saga-handlers';

import AppInitializationContainer from 'components/AppInitializationContainer';
import { HeadDataSwitchContainerProvider } from 'components/HeadDataSwitchContainer';

import { initStore } from 'utils/initStore';

import { getProcessedRenderingResultData } from './utils';

import type { StaticRouterContext as IRouterContext } from 'react-router';
import type { TServerAppRender } from '@react-ssr-pack/server';
import type { IHeadDataSwitchContainerContext } from 'components/HeadDataSwitchContainer';
import type { IRenderOptionsExtension } from '../types';

const serverAppRender: TServerAppRender<IRenderOptionsExtension> = async ({
    app: AppComponent,
    preloadedState,
    request,
    reducers,
    sagas
}) => {
    const routerContext: IRouterContext = {};
    const headDataContext = {} as IHeadDataSwitchContainerContext;
    const initialStore = preloadedState ? JSON.parse(preloadedState) : null;
    const { onSagaAction, waitSaga } = getReduxSagaHandlers();

    let { store, saga } = initStore(reducers, sagas, initialStore, onSagaAction);

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
            <PortalsContextProvider value={[]}>
                <StaticRouter
                    location={request.url}
                    context={routerContext}
                >
                    <ReduxStoreProvider store={store}>
                        <AppInitializationContainer>
                            <AppComponent />
                            <PortalsCollection />
                        </AppInitializationContainer>
                    </ReduxStoreProvider>
                </StaticRouter>
            </PortalsContextProvider>
        </HeadDataSwitchContainerProvider>
    ), onRenderedHandler);

    return getProcessedRenderingResultData({
        store: !preloadedState ? store : null,
        renderingResult,
        headDataContext,
        routerContext
    });
};

export default serverAppRender;
