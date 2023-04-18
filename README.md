# React SSR Pack

## Description

### Toolkit for creating a server side rendering application

This is Toolkit for creating a server side rendering application based on:

 - Webpack 5 or later
 - React v18 or later
 - Redux
 - Redux Saga

## Integration

#### NOTE: Full phased integration documentation is under development. See details later. But an integration example is already available in the form of a ready-made project configuration

Full example of webpack configuration for using this lib you can see in example application:

https://github.com/frolant/react-ssr-pack/tree/master/example

In example app gives examples of server side rendering configuration with the React SSR Pack library,
as well as examples of setting up the following resources:

#### Webpack config commons examples for client and server

 - Dev server section with use live and hot reload and server side rendering on development
 - Optimisation section for example of app parts emitting for client and server
 - Resolve section with @react-ssr-pack/resolve-plugin settings example
 - Loader section with @react-ssr-pack/babel-plugin settings example
 - Common config parts with entry, stats, performance, etc

#### Webpack loader's settings examples

 - babel-loader
 - ts-loader
 - css-loader
 - postcss-loader
 - asset/source and asset/resource internal webpack loaders

#### Webpack plugin's settings examples

 - MiniCssExtractPlugin
 - DefinePlugin
 - ProgressPlugin
 - CopyWebpackPlugin
 - HtmlWebpackPlugin
 - CompressionPlugin
 - HotModuleReplacementPlugin
 - ForkTsCheckerWebpackPlugin
 - ESLintPlugin
 - StylelintPlugin
 - NodemonPlugin
 - ReactRefreshWebpackPlugin

#### Additional recipes

 - An example of the configuration entrypoints for build and start on client and server side
 - An example of the configuration of the Redux Store
 - Added Saga settings for working TAKE and RACE effects on the server side
 - It also shows examples of setting up SEO for html head content on client and server
 - Typescript and linters common configuration

## Run example React SSR Pack Application

For running example, execute this commands:

### Initialize project

```shell
npm run init
```

This command run npm install, lerna bootstrap, etc.

### Build packages

```shell
npm run build
```

This command build monorepo packages for using in example app.

### Run example application

```shell
npm run start
```

This command run example app in development mode.

## Development and testing React SSR Pack library packages

#### For development and testing library packages on example app:

1. Start watching mode on packages by one from two ways:
   - For start watching mode in all packages, execute `npm run watch:to:lib` command
   - For start watching mode on specified packages:
     - Edit config file `local.config.json` (created with `npm run init`) and write in field `watchingPackagesNames` necessary for watching packages names.
     - Execute `npm run watch` for start watching mode on packages specified in config file

2. Execute `npm run start` for run example app and testing updates.

#### For development and testing library packages on your app repository without packages publish:

1. Edit config file `local.config.json`:
   - `appRepositoryRelativePath` - Set your repo relative path
   - `watchingToApp` - Set "true" for save build results in your repo
   - `watchingPackagesNames` - Specify packages for start watching mode
2. Execute `npm run watch` for start watching mode on specified packages
3. Start you project in development or build mode for testing updates

On you chose development mode on your project, you have to set up your webpack config for support watching changes in `node_modules` path too.
At least:
```javascript
module.exports = ({
    // ...your config
    snapshot: {
        managedPaths: []
    }
});
```
