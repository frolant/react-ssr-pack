export type TCacheData = Map<string, string>;

export const createCacheData = (): TCacheData => new Map();

export const getProcessedData = (data: any): string => {
    return JSON.stringify(data).replace(/</g, '\\u003c');
};
