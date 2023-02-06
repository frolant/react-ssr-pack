'use strict';

const { spawn } = require('child_process');

const {
    watchingToApp = false,
    watchingPackagesNames: packagesNames = []
} = require('../local.config.json');

function getScopeOptions() {
    const namesListLine = packagesNames.map((packageName) => `${packageName}`).join(',');
    return packagesNames.length > 1 ? `--scope='@react-ssr-pack/{${namesListLine}}'` : `--scope='@react-ssr-pack/${namesListLine}'`;
}

(async function() {
    const destinationOption = watchingToApp ? 'app' : 'lib';
    const scopeOptions = packagesNames.length ? getScopeOptions() : '';

    spawn(`lerna run watch:to:${destinationOption} --parallel --stream ${scopeOptions}`, {
        stdio: 'inherit',
        shell: true
    });
}());
