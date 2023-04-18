import type { IRunAppServerOptions } from '@react-ssr-pack/server';

export const serverInitializationHandler: IRunAppServerOptions['onServerInitialization'] = (server) => {
    server.set('etag', 'strong');

    if (!__IS_PRODUCTION_MODE__) {
        server.get('/check-server-availability', async (_, response) => {
            return response.send();
        });
    }

    server.get('*', async (request, response) => {
        response.append('Last-Modified', new Date().toUTCString());
        return request.next();
    });
};
