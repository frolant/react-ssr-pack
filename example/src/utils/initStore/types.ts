import type { ReducersMapObject, Store, StoreEnhancer } from 'redux';
import type { Task } from '@redux-saga/types';
import type { Saga } from 'redux-saga';

type TReducers = ReducersMapObject<any, any>;
type TSagas = Array<() => Generator>;

export type TStore = Store<any, any> & { dispatch: any };

export interface TStoreService {
    store: TStore;
    saga: Task;
}

export type TInitStore = (
    reducers: TReducers,
    sagas: TSagas,
    initialStore?: TStore,
    onSagaAction?: (effect: any) => void
) => TStoreService;

export interface TStoreDataProvider {
    get: () => TStore;
    set: (data: TStore) => void;
}

export type TCreateRootSaga = (sagas: TSagas) => Saga<[]>;

export type TCreateStore = (sagas: TReducers, middlewares: StoreEnhancer<{ dispatch: any }, any>, initialStore: TStore) => TStore;
