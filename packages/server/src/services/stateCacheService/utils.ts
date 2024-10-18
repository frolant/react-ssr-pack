import zlib from 'zlib';

export type TCacheData = Map<string, string>;

export const createCacheData = (): TCacheData => new Map();

export const getProcessedData = (data: any): string => {
    return JSON.stringify(data).replace(/</g, '\\u003c');
};

export const getKey = (key: string): string => {
    return decodeURIComponent(key).split('/').filter(Boolean).join(':');
};

export const getCompressedData = (data: string): string => {
    return zlib.deflateSync(data).toString('base64');
};

export const getDecompressedData = (data: string): string => {
    return zlib.inflateSync(Buffer.from(data, 'base64')).toString();
};
