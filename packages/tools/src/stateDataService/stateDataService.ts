import { createStateData, createStateDataItem } from './utils';

import type { IStateDataItem } from './utils';

let STATE_DATA = createStateData();

export const checkStateIdExistence = (stateId: string): boolean => {
    return !!STATE_DATA.get(stateId);
};

export const addStateDataItem = (stateId: string, stateValue: any): void => {
    const stateDataItem = createStateDataItem(stateId, stateValue);
    STATE_DATA.set(stateId, stateDataItem);
};

export const getStateDataItem = (stateId: string): IStateDataItem => {
    return STATE_DATA.get(stateId);
};

export const resetStateData = (): void => {
    STATE_DATA = createStateData();
};
