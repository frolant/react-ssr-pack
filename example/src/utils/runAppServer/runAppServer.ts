import runAppServer, { logLevels } from '@react-ssr-pack/server';

import { serverInitializationHandler } from './utils';

import type { TServerAppRender, TRenderAppConfig } from '@react-ssr-pack/server';

// About logLevels:
// For detailed debug and trace useEffects execution on server side rendering: logLevels.trace.
// Optimal for development: logLevels.development (show errors and restarts info).
// For production: logLevels.critical (no colors, start and errors only) or logLevels.debug (with timestamps).

export default (serverAppRender: TServerAppRender<any>, appConfig: TRenderAppConfig): void => runAppServer({
    logLevel:  __IS_PRODUCTION_MODE__ ? logLevels.critical : __IS_TRACE_SSR_MODE__ ? logLevels.trace : logLevels.development,
    port: __SERVER_SIDE_RENDERING_PORT__,
    serverAppRender,
    appConfig,
    onServerInitialization: serverInitializationHandler
});
