import { checkEffectIdExistence, addEffectsDataItem, checkEffectForNeedExecution, processExecutionCount } from '../effectsDataService';

export const nodeUseEffect = (callback: () => any, effectId: string, maxExecutionsCount: number, effectFilePath: string): void => {
    if (!checkEffectIdExistence(effectId)) {
        addEffectsDataItem(effectId, effectFilePath);
    }

    if (checkEffectForNeedExecution(effectId, maxExecutionsCount)) {
        callback();
    }

    processExecutionCount(effectId, maxExecutionsCount);
};
