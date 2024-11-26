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

const findRendersCount = (text = '') => {
    const match = text.match(/\D*=\D*(\d*)\D*/);
    const isFound = match && match.length > 1;
    const findingResult = isFound ? Number(match[1]) : null;
    const isInteger = (findingResult ^ 0) === findingResult;

    return isFound && isInteger ? findingResult : DEFAULT_SSR_RENDERS_COUNT;
};

const getRendersCount = (code = '', arguments = []) => {
    let result = DEFAULT_SSR_RENDERS_COUNT;

    if (arguments[0]) {
        const { start, end } = arguments[0].body || {};
        const rendersCountData = code.slice(start, end).split(SSR_RENDERS_COUNT_VARIABLE);

        if (rendersCountData.length > 1) {
            const rendersCountCodePart = rendersCountData[1].slice(0, 10);
            result = findRendersCount(rendersCountCodePart);
        }
    }

    return result;
};

const NodeAppRenderingBabelPlugin = (api) => {
    const { StringLiteral, NullLiteral } = api.types;
    api.caller(getTarget);

    return {
        name: 'NodeAppRenderingBabelPlugin',
        visitor: {
            CallExpression({ node }, { opts, file }) {
                const { code, opts: { filename, cwd }} = file;

                getEffects(opts).forEach((effect) => {
                    if (node.callee.name === effect) {
                        const { arguments = [], loc = {} } = node;
                        const filePath = path.relative(cwd, filename);
                        const effectId = md5(`${filePath}${loc.start.index}`);
                        const rendersCount = getRendersCount(code, arguments);

                        arguments.push(
                            StringLiteral(effectId),
                            StringLiteral(rendersCount.toString()),
                            isDevelopmentMode ? StringLiteral(`${filePath}:0`) : NullLiteral(null) // ${node.loc.start.line}
                        );
                    }
                });
            }
        }
    };
};

module.exports = NodeAppRenderingBabelPlugin;
