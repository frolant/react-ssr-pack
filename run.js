'use strict';

const { spawn } = require('child_process');
const { resolve } = require('path');

const webpack = resolve(__dirname, './node_modules/.bin/webpack');

const commands = {
    ['build']: (packageName) => `cd ../../ && ${webpack} --mode production --env packageName=${packageName}`,
    ['watch-to-lib']: (packageName) => `cd ../../ && ${webpack} --mode development --env packageName=${packageName}`,
    ['watch-to-app']: (packageName) => `cd ../../ && ${webpack} --mode development --env packageName=${packageName} watchToApp`
};

const spawnOptions = {
    stdio: 'inherit',
    shell: true
};

(async function() {
    const [ command, packageName, additionalOptions ] = process.argv.slice(2, 5);
    const processedCommand = `${commands[command](packageName)}${additionalOptions ? ` ${additionalOptions}` : ''}`;

    spawn(processedCommand, spawnOptions).on('exit', (code) => {
        if (code) {
            process.exitCode = code;
        }
    });
}());
