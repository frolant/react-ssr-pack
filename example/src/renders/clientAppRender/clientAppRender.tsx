import { hydrateRoot, createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import { HeadDataSwitchContainerProvider } from 'components/HeadDataSwitchContainer';

import { document } from 'utils/window';

import AppInitializationContainer from 'components/AppInitializationContainer';

import { initStore } from 'utils/initStore';

import 'normalize.css/normalize.css';

import type { ReactNode } from 'react';
import type { Root } from 'react-dom/client';
import type { TClientAppRender } from '@react-ssr-pack/server';
import type { IRenderOptionsExtension } from '../types';

const rootElement = document.getElementById('root');

const runApp = (App: ReactNode): Root | void => {
    return rootElement.innerHTML ? hydrateRoot(rootElement, App) : createRoot(rootElement).render(App);
};

const clientAppRender: TClientAppRender<IRenderOptionsExtension> = ({
    app: AppComponent,
    reducers,
    sagas
}) => {
    const history = createBrowserHistory();
    const initialStore = window.__PRELOADED_STATE__;
    const { store } = initStore(reducers, sagas, initialStore);
    delete window.__PRELOADED_STATE__;

    return runApp((
        <HeadDataSwitchContainerProvider>
            <Provider store={store}>
                <Router history={history}>
                    <AppInitializationContainer
                        contentRef={rootElement}
                    >
                        <AppComponent />
                    </AppInitializationContainer>
                </Router>
            </Provider>
        </HeadDataSwitchContainerProvider>
    ));
};

export default clientAppRender;
