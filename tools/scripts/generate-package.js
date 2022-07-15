'use strict';

const fs = require('fs');

const copyFiles = [
    '.npmignore',
    '.npmrc'
];

const patchFiles = [
    'tsconfig.json',
    'package.json'
];

(async function() {
    const packageName = process.argv[2];
    const packagePath = getPackagePath(packageName);

    await makeDir(`${packagePath}/src`);
    await createFile(`${packagePath}/src/index.ts`, `// There should be a ${packageName} code`);

    copyFiles.forEach((name) => {
        fs.copyFileSync(`./tools/scripts/templates/${name}`, `${packagePath}/${name}`);
    });

    patchFiles.forEach((name) => {
        patchAndCopyFile({
            path: `./tools/scripts/templates/${name}`,
            dest: `${packagePath}/${name}`,
            packageName
        });
    });
}());

function getPackagePath(packageName) {
    return `./packages/${packageName}`;
}

function makeDir(path) {
    return new Promise((resolve) => {
        fs.mkdir(path, {
            recursive: true
        }, resolve);
    });
}

function createFile(path, data = '') {
    return writeFile(path, data);
}

function writeFile(path, content) {
    return new Promise((resolve) => {
        fs.writeFile(path, content, resolve);
    });
}

function patchAndCopyFile({ path, dest, packageName }) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        fs.writeFile(dest, data.replace(/\$\{packageName\}/ig, packageName), function (err) {
            if (err) {
                return console.warn(err);
            }
        });
    });
}
