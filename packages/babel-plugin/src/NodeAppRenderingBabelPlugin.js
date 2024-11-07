const md5 = require('md5');
const path = require('path');

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const DEFAULT_EFFECT_NAME = 'useEffect';
const SSR_RENDERS_COUNT_VARIABLE = 'SSR_RENDERS_COUNT';
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
                let defaultScopeSSRRendersCount = DEFAULT_SSR_RENDERS_COUNT;

                if (scope.globals[SSR_RENDERS_COUNT_VARIABLE]) {
                    const position = scope.globals[SSR_RENDERS_COUNT_VARIABLE].end;
                    const localCountData = code.slice(position, position + 10).match(/[0-9]+/);
                    defaultScopeSSRRendersCount = localCountData ? localCountData[0] : defaultScopeSSRRendersCount;
                }

                getEffects(opts).forEach((effect) => {
                    if (node.callee.name === effect) {
                        let ssrRendersCount = defaultScopeSSRRendersCount;
                        const { arguments = [], loc = {} } = node;
                        const filePath = path.relative(cwd, filename);
                        const effectId = md5(`${filePath}${loc.start.index}`);

                        if (arguments[0]) {
                            const { start, end } = arguments[0].body || {};
                            const data = code.slice(start, end).split(SSR_RENDERS_COUNT_VARIABLE);

                            if (data.length > 1) {
                                const localCountData = data[1].slice(0, 10).match(/[0-9]+/);
                                ssrRendersCount = localCountData ? localCountData[0] : ssrRendersCount;
                            }
                        }

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
