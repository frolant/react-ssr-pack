export const getStateScriptContent = (state: string): string => {
    return `window.__PRELOADED_STATE__ = ${state || 'null'};`;
};
