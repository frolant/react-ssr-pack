import zlib from 'zlib';
import { createCacheData, getProcessedData } from './utils';

import type { IStateCacheService } from '../../types';

const clearCacheItemsLengthLimit = 100;

const getKey = (key: string): string => {
    return decodeURIComponent(key).split('/').filter(Boolean).join(':');
};

export const createStateCacheService = (): IStateCacheService => {
    const cache = createCacheData();
    return {
        getItem: async (key) => {
            const data = cache.get(getKey(key));
            return data ? zlib.inflateSync(Buffer.from(data, 'base64')).toString() : data;
        },
        setItem: async (key, data) => {
            const processedData = getProcessedData(data);
            const compressedData = processedData ? zlib.deflateSync(processedData).toString('base64') : null;

            compressedData && cache.set(getKey(key), compressedData);

            if (compressedData && cache.size > clearCacheItemsLengthLimit) {
                const oldItemId = [ ...cache.keys() ].shift();
                cache.delete(oldItemId);
            }
        }
    };
};
