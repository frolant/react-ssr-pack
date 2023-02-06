'use strict';

const fs = require('fs');

const packageFilesData = {
    'index.ts': '/src',
    'README.md': null,
    'tsconfig.json': null,
    'package.json': null,
    '.npmignore': null,
    '.npmrc': null
};

const patchAndCopyFile = ({ sourcePath, destinationPath, packageName }) => {
    const sourceFileData = fs.readFileSync(sourcePath, {
        encoding: 'utf-8'
    });

    const destinationFileData = sourceFileData.replace(/\$\{packageName}/ig, packageName)

    fs.writeFileSync(destinationPath, destinationFileData);
};

(function() {
    const packageName = process.argv[2];
    const packagePath = `./packages/${packageName}`;

    Object.keys(packageFilesData).forEach((fileName) => {
        const filePath = packageFilesData[fileName];

        if (filePath) {
            fs.mkdirSync(`${packagePath}${filePath}`, {
                recursive: true
            });
        }

        patchAndCopyFile({
            sourcePath: `./tools/templates/${fileName}`,
            destinationPath: `${packagePath}${filePath || ''}/${fileName}`,
            packageName
        });
    });
}());
