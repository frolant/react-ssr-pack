import { createCacheData, getProcessedData, getDataItemId, getCompressedData, getDecompressedData } from './utils';

import type { IStateCacheService } from '../../types';

const clearCacheItemsLengthLimit = 100;
const cacheItemsLifeTimeLimitMs = 60000;

export const createStateCacheService = (): IStateCacheService => {
    const cache = createCacheData();
    return {
        getItem: async (key) => {
            const time = Date.now();
            const id = getDataItemId(key);
            const data = cache.get(id);
            const isLifeTimeExpired = !data || ((time - data.time) > cacheItemsLifeTimeLimitMs);

            isLifeTimeExpired && cache.delete(id);

            return isLifeTimeExpired ? null : getDecompressedData(data.data);
        },
        setItem: async (key, data) => {
            const time = Date.now();
            const processedData = getProcessedData(data);
            const compressedData = processedData ? getCompressedData(processedData) : null;

            compressedData && cache.set(getDataItemId(key), {
                data: compressedData,
                time
            });

            if (compressedData && cache.size > clearCacheItemsLengthLimit) {
                const oldItemId = [ ...cache.keys() ].shift();
                cache.delete(oldItemId);
            }
        }
    };
};
