import { createEffectsData, createEffectsDataItem, EffectStatus } from './utils';

import type { TEffectsDataItems, IEffectsDataItem, TDependencies } from './utils';

let EFFECTS_DATA = createEffectsData();

const getEffectsDataItems = (): TEffectsDataItems => Array.from(EFFECTS_DATA.values());

export const getEffectsDataItem = (effectId: string): IEffectsDataItem => {
    return EFFECTS_DATA.get(effectId);
};

export const addEffectsDataItem = (id: string, filePath: string, dependencies: TDependencies): void => {
    const effectsDataItem = createEffectsDataItem(id, filePath, dependencies);
    EFFECTS_DATA.set(id, effectsDataItem);
};

export const getEffectsFilePathsData = (): string[] => {
    return getEffectsDataItems().map((item) => item.getFilePath());
};

export const resetEffectsData = (): void => {
    EFFECTS_DATA = createEffectsData();
};

export const getExecutedEffectsDataItemsCount = (): number => {
    return getEffectsDataItems().filter((item) => item.getStatus() === EffectStatus.executed).length;
};

export const setEffectsDataItemsStatusesToProcessed = (): void => {
    getEffectsDataItems().map((item) => item.setProcessedStatus());
};
