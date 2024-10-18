import { createCacheData, getProcessedData, getKey, getCompressedData, getDecompressedData } from './utils';

import type { IStateCacheService } from '../../types';

const clearCacheItemsLengthLimit = 100;

export const createStateCacheService = (): IStateCacheService => {
    const cache = createCacheData();
    return {
        getItem: async (key) => {
            const data = cache.get(getKey(key));
            return data ? getDecompressedData(data) : data;
        },
        setItem: async (key, data) => {
            const processedData = getProcessedData(data);
            const compressedData = processedData ? getCompressedData(processedData) : null;

            compressedData && cache.set(getKey(key), compressedData);

            if (compressedData && cache.size > clearCacheItemsLengthLimit) {
                const oldItemId = [ ...cache.keys() ].shift();
                cache.delete(oldItemId);
            }
        }
    };
};
