const initialisationCommands = [
    'npm install --silent --no-audit --no-fund --no-save',
    'node ./tools/initialize-local-config.js'
];

const testingCommands = [
    'echo code checking with \u001b[1mstylelint\x1b[0m...',
    'stylelint ./{packages/**/src,example/src}/**/*.{css,scss} --max-warnings 0',
    'echo code checking with \u001b[1meslint\x1b[0m...',
    'eslint ./packages --max-warnings 0',
    'echo code checking \u001b[1m\u001b[32mpassed\x1b[0m',
];

const initCompleteMessage = 'echo initialization \u001b[1m\u001b[32mcomplete\x1b[0m';

module.exports = ({
    question: 'Choose command:',
    answers: () => ([
        {
            command: 'start',
            execute: () => 'cd ./example && npm run app:hot'
        },
        {
            command: 'watch',
            question: 'Choose watch type:',
            answers: () => ([
                {
                    command: 'lib',
                    execute: () => 'lerna run watch:to:lib --parallel --stream'
                },
                {
                    command: 'app',
                    execute: () => 'lerna run watch:to:app --parallel --stream'
                },
                {
                    command: 'configured',
                    execute: () => 'node ./tools/start-configured-watch.js'
                },
            ])
        },
        {
            command: 'build',
            question: 'Choose build type:',
            answers: () => ([
                {
                    command: 'all',
                    execute: () => 'lerna run build --stream'
                },
                {
                    command: 'changes',
                    execute: () => 'lerna run build --stream --since'
                }
            ])
        },
        {
            command: 'test',
            execute: () => `${initialisationCommands.join(' && ')} && ${testingCommands.join(' && ')}`
        },
        {
            command: 'init',
            execute: () => `${initialisationCommands.join(' && ')} && ${initCompleteMessage}`
        },
        {
            command: 'publish',
            execute: () => 'cli test && cli build changes && lerna publish patch --exact --yes'
        },
        {
            command: 'add',
            question: `Insert package name:`,
            execute: (packageName) => `node ./tools/generate-package.js ${packageName}`
        }
    ])
});
