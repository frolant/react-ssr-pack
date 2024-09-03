import { createCacheData, getProcessedData } from './utils';

export interface IStateCacheService {
    createItem: (id: string, data: string) => void;
    getItem: (id: string) => string;
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
