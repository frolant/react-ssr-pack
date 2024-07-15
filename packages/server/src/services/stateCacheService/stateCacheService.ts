import { createCacheData, getProcessedData } from './utils';

import type { TCacheData } from './utils';

export interface IStateCacheService {
    create: (id: string, data: string) => void;
    get: (id: string) => string;
    delete: (id: string) => void;
}

export const createStateCacheService = (): IStateCacheService => {
    const cache: TCacheData = createCacheData();
    return {
        create: (id, data) => cache.set(id, getProcessedData(data)),
        get: (id) => cache.get(id),
        delete: (id) => cache.delete(id)
    };
};
