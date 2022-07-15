import { createEffectsData, createEffectsDataItem, EffectStatus } from './utils';
import type { TEffectsDataItems } from './utils';

let EFFECTS_DATA = createEffectsData();

const getEffectsDataItems = (): TEffectsDataItems => Array.from(EFFECTS_DATA.values());

export const checkEffectIdExistence = (effectId: string): boolean => {
    return !!EFFECTS_DATA.get(effectId);
};

export const addEffectsDataItem = (effectId: string, effectFilePath: string): void => {
    const effectsDataItem = createEffectsDataItem(effectId, effectFilePath);
    EFFECTS_DATA.set(effectId, effectsDataItem);
};

export const getAddedEffectsDataItemsCount = (): number => {
    return getEffectsDataItems().filter((item) => item.getStatus() === EffectStatus.added).length;
};

export const setEffectsDataItemsStatusesToProcessed = (): void => {
    getEffectsDataItems().map((item) => item.setStatusProcessed());
};

export const getEffectsFilePathsData = (): string[] => {
    return getEffectsDataItems().map((item) => item.getFilePath());
};

export const resetEffectsData = (): void => {
    EFFECTS_DATA = createEffectsData();
};
