import { createCacheData, getProcessedData } from './utils';

export interface IStateCacheService {
    getItem: (id: string) => string;
    createItem: (id: string, data: string) => void;
}

const clearCacheItemsLengthLimit = 100;

export const createStateCacheService = (): IStateCacheService => {
    const cache = createCacheData();
    return {
        getItem: (id) => cache.get(id),
        createItem: (id, data) => {
            cache.set(id, getProcessedData(data));

            if (cache.size > clearCacheItemsLengthLimit) {
                const oldItemId = [ ...cache.keys() ].shift();
                cache.delete(oldItemId);
            }
        }
    };
};
