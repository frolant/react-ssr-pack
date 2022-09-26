const md5 = require('md5');
const path = require('path');

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const defaultEffectName = 'useEffect';

const getTarget = (caller) => caller && caller.target;

const getEffects = (options) => {
    const effectName = options && (typeof options.effect === 'string' || Array.isArray(options.effect)) ? options.effect : defaultEffectName;
    return Array.isArray(effectName) ? effectName : [effectName];
};

const NodeAppRenderingBabelPlugin = (api) => {
    const { StringLiteral, NullLiteral } = api.types;
    const nullArg = NullLiteral(null);
    api.caller(getTarget);

    return {
        name: 'NodeAppRenderingBabelPlugin',
        visitor: {
            CallExpression({ node }, { opts, file: { opts: { filename, cwd } } }) {
                getEffects(opts).forEach((effect) => {
                    if (node.callee.name === effect) {
                        const filePath = path.relative(cwd, filename);
                        const effectId = md5(`${filePath}${node.loc.start.index}`);

                        if (node.arguments.length === 1) {
                            node.arguments.push(nullArg);
                        }

                        node.arguments.push(
                            StringLiteral(effectId),
                            isDevelopmentMode ? StringLiteral(`${filePath}:${node.loc.start.line}`) : nullArg
                        );
                    }
                });
            }
        }
    };
};

module.exports = NodeAppRenderingBabelPlugin;
