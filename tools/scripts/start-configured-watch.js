'use strict';

const { spawn } = require('child_process');

const {
    watchingToApp = false,
    updateTypesOnceOnWatchingToApp = true,
    watchingPackagesNames: packagesNames = []
} = require('../../local.config.json');

function getScopeOptions() {
    const namesListLine = packagesNames.map((packageName) => `${packageName}`).join(',');
    return packagesNames.length > 1 ? `--scope='@react-ssr-pack/{${namesListLine}}'` : `--scope='@react-ssr-pack/${namesListLine}'`;
}

(async function() {
    const destinationOption = watchingToApp ? 'app' : 'lib';
    const scopeOptions = packagesNames.length ? getScopeOptions() : '';
    const typesUpdateOption = watchingToApp && !updateTypesOnceOnWatchingToApp ? ':types' : '';
    spawn(`lerna run watch:to:${destinationOption}${typesUpdateOption} --parallel ${scopeOptions}`, {
        stdio: 'inherit',
        shell: true
    });
}());
