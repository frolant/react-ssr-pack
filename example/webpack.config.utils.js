const http = require('http');

const serverConfig = {
    host: '0.0.0.0',
    devServerMaxTimeout: 120,
    devServerPort: 3000,
    serverSideRenderingPort: 3001
};

const isServerSideRenderingAvailable = (appHost) => new Promise((resolve) => {
    http.get(`${appHost}/check-server-availability`, ((response) => {
        response.resume();
        resolve(response.statusCode === 200);
    })).on('error', () => resolve(false));
}).catch(() => {});

const waitOneSecond = () => new Promise((resolve) => setTimeout(resolve, 1000));

const checkServerSideRenderingAvailability = async (serverSideRenderingHost) => {
    const maxCheckingCount = serverConfig.devServerMaxTimeout;

    await new Promise(async (resolve) => {
        for (let count = 0; count < maxCheckingCount; count++) {
            if (await isServerSideRenderingAvailable(serverSideRenderingHost)) {
                resolve();
                break;
            } else {
                await waitOneSecond();
            }
        }

        resolve();
    }).catch(() => {});

    return null;
};

const getOutputGroupName = ({ chunk: { idNameHints, name } }) => [...idNameHints][0] || name || 'ungrouped';

const getOutputScriptFileName = (data, type, isServerSideRendering) => {
    return isServerSideRendering ? '[name].js' : `scripts/${getOutputGroupName(data)}.${type}.[id].js`;
};

module.exports = ({
    checkServerSideRenderingAvailability,
    getOutputScriptFileName,
    getOutputGroupName,
    serverConfig
});
