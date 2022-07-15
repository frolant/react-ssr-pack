const { resolve } = require('path');

const babelLoader = [{
    loader: 'babel-loader',
    options: {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
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
                            "development": true
                        }
                    ]
                ]
            }
        }
    }
}];

const tsLoader = ({ watchWithTypes, appRepositoryPath, packageName }) => ([
    ...babelLoader,
    {
        loader: 'ts-loader',
        ...(watchWithTypes && {
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
