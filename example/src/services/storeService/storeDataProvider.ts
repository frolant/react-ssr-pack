import type { TStore, TStoreDataProvider } from './types';

const createStoreDataProvider = (): TStoreDataProvider => {
    let store: TStore;
    return {
        get: () => store,
        set: (data) => {
            store = data;
        }
    };
};

export default createStoreDataProvider();
