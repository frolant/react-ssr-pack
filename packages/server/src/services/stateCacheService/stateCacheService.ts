import { createCacheData, getProcessedData } from './utils';

import type { IStateCacheService } from '../../types';

const clearCacheItemsLengthLimit = 100;

export const createStateCacheService = (): IStateCacheService => {
    const cache = createCacheData();
    return {
        getItem: async (id) => cache.get(id),
        setItem: async (id, data) => {
            cache.set(id, getProcessedData(data));

            if (cache.size > clearCacheItemsLengthLimit) {
                const oldItemId = [ ...cache.keys() ].shift();
                cache.delete(oldItemId);
            }
        }
    };
};
