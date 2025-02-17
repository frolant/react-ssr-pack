const { resolve } = require('path');

const babelLoader = [{
    loader: 'babel-loader',
    options: {
        "presets": [
            "@babel/preset-env",
            [
                "@babel/preset-react",
                {
                    "runtime": "automatic"
                }
            ]
        ],
        "plugins": [
            "@babel/plugin-proposal-export-default-from"
        ],
        "env": {
            "development": {
                "presets": [
                    [
                        "@babel/preset-react",
                        {
                            "runtime": "automatic",
                            "development": true
                        }
                    ]
                ]
            }
        }
    }
}];

const tsLoader = ({ watchToApp, appRepositoryPath, packageName }) => ([
    ...babelLoader,
    {
        loader: 'ts-loader',
        ...(watchToApp && {
            options: {
                compilerOptions: {
                    outDir: resolve(__dirname, `${appRepositoryPath}/node_modules/@react-ssr-pack/${packageName}/lib`)
                }
            }
        })
    }
]);

module.exports = ({
    babelLoader,
    tsLoader
});
