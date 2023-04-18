'use strict';

const fs = require('fs');
const path = require('path');

const updateLibraryFromSource = (from, to) => {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    } else {
        fs.rmSync(to, {
            recursive: true,
            force: true
        });

        fs.mkdirSync(to);
    }

    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            updateLibraryFromSource(path.join(from, element), path.join(to, element));
        }
    });
}

(async function() {
    const startTime = new Date().getTime();

    const packageName = process.argv[2];
    const sourcePath = `../../packages/${packageName}/src`;
    const libraryPath = `../../packages/${packageName}/lib`;

    updateLibraryFromSource(sourcePath, libraryPath);

    const endTime = new Date().getTime();
    const compilationTime = endTime - startTime;

    console.log(`${packageName} source code copied to lib \u001b[1m\u001b[32msuccessfully\x1b[0m in ${compilationTime} ms`);
}());
