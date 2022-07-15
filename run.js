'use strict';

const { spawn } = require('child_process');

const { webpack } = require('./local.config.json');

const commands = {
    ['build']: (packageName) => `cd ../../ && ${webpack} --mode production --env packageName=${packageName}`,
    ['watch-to-lib']: (packageName) => `cd ../../ && ${webpack} --mode development --env packageName=${packageName}`,
    ['watch-to-app']: (packageName) => `cd ../../ && ${webpack} --mode development --env packageName=${packageName} watchToApp`,
    ['watch-to-app-types']: (packageName) => `cd ../../ && ${webpack} --mode development --env packageName=${packageName} watchToApp watchWithTypes`
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
