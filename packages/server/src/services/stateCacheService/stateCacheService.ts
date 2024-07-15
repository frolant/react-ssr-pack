import { createCacheData, getProcessedData } from './utils';

import type { TCacheData } from './utils';

export interface IStateCacheService {
    getItem: (id: string) => string;
    deleteItem: (id: string) => void;
    createItem: (id: string, data: string) => void;
}

const clearCacheItemsLengthLimit = 1000;

export const createStateCacheService = (): IStateCacheService => {
    const cache: TCacheData = createCacheData();
    return {
        getItem: (id) => cache.get(id),
        deleteItem: (id) => cache.delete(id),
        createItem: (id, data) => {
            cache.size > clearCacheItemsLengthLimit && cache.clear();
            cache.set(id, getProcessedData(data));
        }
    };
};
