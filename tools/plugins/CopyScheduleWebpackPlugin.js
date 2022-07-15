'use strict';

const fs = require('fs');
const path = require('path');

const defaultOptions = {
    sourcePath: null,
    destinationPath: null,
    copyOnFirstReBuildIterationOnly: false
};

class CopyScheduleWebpackPlugin {
    constructor(options = {}) {
        const { sourcePath, destinationPath } = options;

        this.isFirstReBuildIteration = true;
        this.isPathsSet = sourcePath && destinationPath;

        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    copyFolderSync(from, to) {
        try {
            fs.mkdirSync(to);
        } catch(e) {}

        fs.readdirSync(from).forEach((element) => {
            const stat = fs.lstatSync(path.join(from, element));

            if (stat.isFile()) {
                fs.copyFileSync(path.join(from, element), path.join(to, element));
            } else if (stat.isSymbolicLink()) {
                fs.symlinkSync(fs.readlinkSync(path.join(from, element)), path.join(to, element));
            } else if (stat.isDirectory()) {
                this.copyFolderSync(path.join(from, element), path.join(to, element));
            }
        });
    }

    apply(compiler) {
        const { sourcePath, destinationPath, copyOnFirstReBuildIterationOnly } = this.options;

        compiler.hooks.afterEmit.tap('CopyScheduleWebpackPlugin', () => {
            if (this.isPathsSet && (!copyOnFirstReBuildIterationOnly || this.isFirstReBuildIteration)) {
                this.isFirstReBuildIteration = false;
                this.copyFolderSync(sourcePath, destinationPath);
            }
        });
    }
}

module.exports = CopyScheduleWebpackPlugin;
