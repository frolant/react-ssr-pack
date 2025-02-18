# @react-ssr-pack/redux-saga-handlers

## Description

### Handlers for Redux-Saga in SSR

Handlers for Redux-Saga TAKE and RACE effects working in SSR.

[Full integration example](https://github.com/frolant/react-ssr-pack/blob/master/example/src/renders/serverAppRender/serverAppRender.tsx)

Short example:
```js
import { nodeAppRender } from '@react-ssr-pack/tools';
import { getReduxSagaHandlers } from '@react-ssr-pack/redux-saga-handlers';

import { initStore } from 'utils/initStore';

const serverAppRender = async ({ options }) => {
    const { onSagaAction, waitSaga } = getReduxSagaHandlers();
    let { store, saga } = initStore(reducers, sagas, initialStore, onSagaAction);

    const onRenderedHandler = async () => {
        await waitSaga();

        store.dispatch(END);

        await saga.toPromise();

        const prevStore = store.getState();
        const { store: nextStore, saga: nextSaga } = initStore(reducers, sagas, prevStore, onSagaAction);

        store = nextStore;
        saga = nextSaga;
    };

    const renderingResult = await nodeAppRender(() => (
        <ReduxStoreProvider store={store}>
            //...Other server app render code
        </ReduxStoreProvider>
    ), onRenderedHandler);

    return renderingResult;
};
```
`onSagaAction` - Add to redux store creation as middleware

`waitSaga` - Await this async handler before get store data on every render

On the server render of the application, create new handlers for each request to the server.

## Installation

```shell
npm install --save @react-ssr-pack/redux-saga-handlers
```
