const http = require('http');

const isServerSideRenderingAvailable = (checkingUrl) => new Promise((resolve) => {
    const request = http.get(checkingUrl, {
        timeout: 2000
    }, ((response) => {
        response.resume();
        resolve(response.statusCode === 200);
    }));

    request.on('timeout', () => {
        request.destroy();
        resolve(false);
    });

    request.on('error', () => {
        resolve(false);
    });
});

const waitOneSecond = () => new Promise((resolve) => setTimeout(resolve, 1000));

const checkServerSideRenderingAvailability = async (
    serverHost = 'http://0.0.0.0:3001',
    checkingUrl = '/check-server-availability',
    maxCheckingCount = 120
) => {
    await new Promise(async (resolve) => {
        for (let count = 0; count < maxCheckingCount; count++) {
            if (await isServerSideRenderingAvailable(`${serverHost}${checkingUrl}`)) {
                resolve();
                break;
            } else {
                await waitOneSecond();
            }
        }

        resolve();
    });

    return null;
};

module.exports = checkServerSideRenderingAvailability;
