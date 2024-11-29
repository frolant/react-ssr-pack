const md5 = require('md5');
const path = require('path');

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const SSR_RENDERS_COUNT_VARIABLE = 'SSR_RENDERS_COUNT';
const DEFAULT_SSR_RENDERS_COUNT = 1;

const getTarget = (caller) => caller && caller.target;

const getEffectItems = (options) => {
    const isEffectInOptions = options && (typeof options.useEffect === 'string' || Array.isArray(options.useEffect));
    const effectName = isEffectInOptions ? options.useEffect : 'useEffect';
    return Array.isArray(effectName) ? effectName : [effectName];
};

const getStateItems = (options) => {
    const isStateInOptions = options && (typeof options.useState === 'string' || Array.isArray(options.useState));
    const effectName = isStateInOptions ? options.useState : 'useState';
    return Array.isArray(effectName) ? effectName : [effectName];
};

const getIdentificationData = (cwd, filename, location = {}) => {
    const filePath = path.relative(cwd, filename);
    return [
        md5(`${filePath}${location.index}`),
        filePath
    ];
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

                getEffectItems(opts).forEach((effect) => {
                    if (node.callee.name === effect) {
                        const { arguments = [], loc = {} } = node;
                        const [ effectId, filePath ] = getIdentificationData(cwd, filename, loc);
                        const rendersCount = getRendersCount(code, arguments);

                        arguments.push(
                            StringLiteral(effectId),
                            StringLiteral(rendersCount.toString()),
                            isDevelopmentMode ? StringLiteral(`${filePath}:0`) : NullLiteral(null) // ${node.loc.start.line}
                        );
                    }
                });

                getStateItems(opts).forEach((state) => {
                    if (node.callee.name === state) {
                        const { arguments = [], loc = {} } = node;
                        const [ stateId ] = getIdentificationData(cwd, filename, loc);

                        arguments.unshift(StringLiteral(stateId));
                    }
                });
            }
        }
    };
};

module.exports = NodeAppRenderingBabelPlugin;
