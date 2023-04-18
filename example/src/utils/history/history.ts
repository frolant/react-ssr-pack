import { createBrowserHistory, History, LocationState, Action } from 'history';

import { isRunInBrowser } from 'utils/window';

const historyBypassData = {
    action: (((() => null as any) as unknown) as Action),
    goBack: (): any => null,
    listen: (): any => null,
    push: (): any => null,
    block: (): any => null,
    length: 0,
    replace: (): any => null,
    go: (): any => null,
    goForward: (): any => null,
    createHref: (): any => null,
    location: {
        pathname: '',
        hash: '',
        search: null,
        state: null
    }
} as History<LocationState>;

export default isRunInBrowser ? createBrowserHistory() : historyBypassData;
