import { checkEffectIdExistence, addEffectsDataItem } from '../effectsDataService';

export const nodeUseEffect = (callback: () => any, effectId: string, effectFilePath: string): void => {
    const isNotExecutedBefore = !checkEffectIdExistence(effectId);

    if (isNotExecutedBefore) {
        addEffectsDataItem(effectId, effectFilePath);
        callback();
    }
};
