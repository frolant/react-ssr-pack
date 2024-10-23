import zlib from 'zlib';

export interface IStateCacheServiceDataItem {
    time: number;
    data: string;
}

export type TCacheData = Map<string, IStateCacheServiceDataItem>;

export const createCacheData = (): TCacheData => new Map();

export const getProcessedData = (data: any): string => {
    return JSON.stringify(data).replace(/</g, '\\u003c');
};

export const getDataItemId = (key: string): string => {
    return decodeURIComponent(key).split('/').filter(Boolean).join(':') || ':';
};

export const getCompressedData = (data: string): string => {
    return zlib.deflateSync(data).toString('base64');
};

export const getDecompressedData = (data: string): string => {
    return zlib.inflateSync(Buffer.from(data, 'base64')).toString();
};
