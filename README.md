# React SSR Pack

## Description

### Toolkit for creating a server side rendering application

This is Toolkit for creating a server side rendering application based on:

 - Webpack
 - React (v18 or later)
 - Redux
 - Redux Saga
 - Express

Redux and Redux Saga can be replaced with alternative libraries for working with application state.
But with them, the library is regularly tested, and I recommend them.

## Motivation

There are many approaches to implement server side rendering.
But most of them involve the additional overhead of executing asynchronous code to get the data from backend etc.
React SSR Pack is designed as a toolkit to implement server side rendering in a React single page application without the need to write additional logic for serve in components.

All asynchronous work in the components is done in the useEffect hooks for both the server and the client.

This should minimize additional coding for the server. It will also allow server-side rendering to be integrated into an existing project without large-scale components refactoring.

## Architecture, features and limitations

When building an application using React SSR Pack, it is assembled for the client in exactly the same way as if there were no some SSR.
But when building application for the server, all useEffect's are registered and replaced by the library functional.

When an application is launched on the server, each useEffect's is guaranteed to be launched once and the application will wait for it to finish.
As a result of the work of the useEffect's, the Store will be enriched with new data.

The application will restart react-render until a render iteration occurs during which there was not quite one new useEffect.

A serious limitation in this case will be that all useEffect's will be executed once, which entails the need to write components in such a way that when they are rendered in useEffect's, there is the necessary data to run asynchronous code.
At the same time, this restriction will be useful in order to force the developer not to enter the component until it has all the necessary data.
This could be a good pattern.

<b>Example</b>: On the first render of the parent component in useEffect's, we get the data that the child component will need.
The child component also has useEffect's in which we get other data based on data from the useEffect's parent component.
We don't go into the child component (use conditional rendering) until there is data in the parent (and its useEffect's is not executed).
So on the first render on the server, we will execute the useEffect's of the parent component.
On the second render, we will execute useEffect's from the child component.
All useEffect's will be executed once and all data will be received.

The limit on the number of executions of the same useEffect is limited for server rendering performance, since the application does not have to take on the work of comparing useEffect dependencies, which speeds up its work on the server several times.

## Integration

#### To integrate the React SSR Pack into the project, you need to perform several steps:

### 1. Install

Install necessary packages:

```shell
npm install @react-ssr-pack/babel-plugin @react-ssr-pack/resolve-plugin --save-dev
npm install @react-ssr-pack/server @react-ssr-pack/tools --save
```

### 2. Set up

#### 2.1 @react-ssr-pack/babel-plugin

Update your babel loader settings and add @react-ssr-pack/babel-plugin in babel-loader section for server side build:

```javascript
module.exports = {
    // ...Your webpack server side config
    module: {
        rules: [
            // ...Your other loaders options
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // ...Your other babel rules,
                        plugins: [
                            // ...Your other babel rules > plugins,
                            '@react-ssr-pack/babel-plugin'
                        ]
                    }
                }
            }
        ]
    }
}
```

This plugin registered and identified all useEffect's in server side build.

#### 2.2 @react-ssr-pack/resolve-plugin

Update your resolve settings and add @react-ssr-pack/resolve-plugin in plugins section for server side build:

```javascript
const ReactSSRPackResolvePlugin = require('@react-ssr-pack/resolve-plugin');

module.exports = {
    // ...Your webpack server side config
    resolve: {
        // ...Your resolve configuration
        alias: {
            // ...Your aliases configuration
            react: '/node_modules/react'
        },
        plugins: [
            // ...Your plugins configuration
            new ReactSSRPackResolvePlugin()
        ]
    }
}
```

This is plugin for resolving and proxying react library on server side build with replace useEffect hook functional.

#### 2.3 @react-ssr-pack/server and @react-ssr-pack/tools

Below is an example using Express web server built into the @react-ssr-pack/server package.
You can choose a different server and set it up yourself using this one as an example.
Use of nodeAppRender from @react-ssr-pack/tools for server-rendering App to string is mandatory (to be described below).

Import runAppServer from @react-ssr-pack/server and use it in entry point for server application.

```javascript
import { runAppServer } from '@react-ssr-pack/server';
import serverAppRender from './renders/serverAppRender'; // Your server render component
import App from 'components/App'; // Your application component

import { reducers } from 'store'; // Your store
import { sagas } from 'store'; // Your root saga

runAppServer({
    logLevel:  logLevels.development,
    port: 3001,
    serverAppRender,
    appConfig: {
        app: App,
        reducers,
        sagas
    }
});
```

In serverAppRender you should use nodeAppRender from @react-ssr-pack/tools for rendering your App to string.

Entry point for client will be the same as a standard react application.

See full examples for serverAppRender, clientAppRender and App component:

 - [serverAppRender](https://github.com/frolant/react-ssr-pack/blob/master/example/src/renders/serverAppRender/serverAppRender.tsx)
 - [clientAppRender](https://github.com/frolant/react-ssr-pack/blob/master/example/src/renders/clientAppRender/clientAppRender.tsx)
 - [App](https://github.com/frolant/react-ssr-pack/blob/master/example/src/components/App/App.tsx)

#### Additional

There are many ways to build a server.
You can use Express (as in the example described above where the Express is run in runAppServer) or another Node server.
You can use a webpack dev server for development, or you can configure the webpack build as middleware.
Below is an example of a complete configuration and implementation of an application using the webpack dev server for development mode (with configured live and hot reload) and Express as web server for server rendering.

### Example configuration

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
module.exports = {
    // ...Your webpack config
    snapshot: {
        managedPaths: []
    }
};
```
