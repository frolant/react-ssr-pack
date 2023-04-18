import type { ReducersMapObject } from 'redux';

export interface IRenderOptionsExtension {
    reducers: ReducersMapObject<any, any>;
    sagas: Array<() => Generator>;
}
