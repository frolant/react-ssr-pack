const md5 = require('md5');
const path = require('path');

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const DEFAULT_EFFECT_NAME = 'useEffect';
const DEFAULT_SSR_RENDERS_COUNT = 1;

const getTarget = (caller) => caller && caller.target;

const getEffects = (options) => {
    const isEffectsInOptions = options && (typeof options.effect === 'string' || Array.isArray(options.effect));
    const effectName = isEffectsInOptions ? options.effect : DEFAULT_EFFECT_NAME;
    return Array.isArray(effectName) ? effectName : [effectName];
};

const NodeAppRenderingBabelPlugin = (api) => {
    const { StringLiteral, NullLiteral } = api.types;
    api.caller(getTarget);

    return {
        name: 'NodeAppRenderingBabelPlugin',
        visitor: {
            CallExpression({ node }, { opts, file }) {
                const { scope, code, opts: { filename, cwd }} = file;

                getEffects(opts).forEach((effect) => {
                    if (node.callee.name === effect) {
                        let ssrRendersCount = DEFAULT_SSR_RENDERS_COUNT;
                        const { arguments = [], loc = {} } = node;

                        if (scope.globals.SSR_RENDERS_COUNT) {
                            const position = scope.globals.SSR_RENDERS_COUNT.end;
                            const localCountData = code.slice(position, position + 10).match(/[0-9]+/);
                            ssrRendersCount = localCountData ? localCountData[0] : ssrRendersCount;
                        }

                        if (arguments[0]) {
                            const { start, end } = arguments[0].body || {};
                            const localCountData = code.slice(start, end).match(/[0-9]+/);
                            ssrRendersCount = localCountData ? localCountData[0] : ssrRendersCount;
                        }

                        const filePath = path.relative(cwd, filename);
                        const effectId = md5(`${filePath}${loc.start.index}`);

                        arguments.push(
                            StringLiteral(effectId),
                            StringLiteral(ssrRendersCount.toString()),
                            isDevelopmentMode ? StringLiteral(`${filePath}:0`) : NullLiteral(null) // ${node.loc.start.line}
                        );
                    }
                });
            }
        }
    };
};

module.exports = NodeAppRenderingBabelPlugin;
