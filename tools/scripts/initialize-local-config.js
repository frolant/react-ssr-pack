'use strict';

const fs = require('fs');

const configFileName = 'local.config.json';

(async function() {
    if (!fs.existsSync(`./${configFileName}`)) {
        fs.copyFileSync(`./tools/scripts/templates/${configFileName}`, `./${configFileName}`);
        console.log('\n Local configuration file created!');
    }
}());
