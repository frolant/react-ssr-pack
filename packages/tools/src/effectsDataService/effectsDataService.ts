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

export const checkEffectForNeedExecution = (effectId: string): boolean => {
    return EFFECTS_DATA.get(effectId).getStatus() === EffectStatus.waiting;
};

export const processExecutionCount = (effectId: string, maxExecutionsCount: number): void => {
    const effect = EFFECTS_DATA.get(effectId);
    effect.increaseExecutionsCount();

    if (effect.getExecutionsCount() >= maxExecutionsCount) {
        effect.setStatusToFinished();
    }
};

export const getWaitingEffectsDataItemsCount = (): number => {
    return getEffectsDataItems().filter((item) => item.getStatus() === EffectStatus.waiting).length;
};

export const getEffectsFilePathsData = (): string[] => {
    return getEffectsDataItems().map((item) => item.getFilePath());
};

export const resetEffectsData = (): void => {
    EFFECTS_DATA = createEffectsData();
};
