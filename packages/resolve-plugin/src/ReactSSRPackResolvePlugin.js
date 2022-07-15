const { join } = require('path');

const context = process.cwd();

const getOverriddenPathDefaultHandler = (request, { processingPath, originalPath, overriddenPath }) => {
    const { path, context: { issuer } } = request;
    const redefineResolve = path === originalPath && issuer.startsWith(processingPath)
    return redefineResolve ? overriddenPath : null;
};

const DEFAULT_OPTIONS = {
    processingPath: join(context, '/src'),
    originalPath: join(context, '/node_modules/react'),
    overriddenPath: join(context, '/node_modules/@react-ssr-pack/react-proxy/lib/index.js'),
    getOverriddenPath: getOverriddenPathDefaultHandler
}

class ReactSSRPackResolvePlugin {
    constructor(options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
    }

    redefineResolve(resolver, request, context, callback) {
        const { getOverriddenPath, ...options } = this.options;
        const overriddenPath = getOverriddenPath(request, options);

        if (overriddenPath) {
            resolver.doResolve(resolver.ensureHook('undescribed-raw-file'), {
                ...request,
                path: overriddenPath,
                relativePath: overriddenPath
            }, `using path: ${overriddenPath}`, context, callback);
        } else {
            callback();
        }
    }

    apply(resolver) {
        resolver
            .getHook('before-existing-directory')
            .tapAsync('ReactSSRPackResolvePlugin', (request, context, callback) => {
                this.redefineResolve(resolver, request, context, callback);
            })
    }
}

module.exports = ReactSSRPackResolvePlugin;
