import { checkEffectIdExistence, addEffectsDataItem, checkEffectForNeedExecution, processExecutionCount } from '../effectsDataService';

export const nodeUseEffect = (callback: () => any, effectId: string, maxExecutionsCount: number, effectFilePath: string): void => {
    const isNotAddedBefore = !checkEffectIdExistence(effectId);

    if (isNotAddedBefore) {
        addEffectsDataItem(effectId, effectFilePath);
    }

    const isNeedExecution = checkEffectForNeedExecution(effectId);

    if (isNeedExecution) {
        processExecutionCount(effectId, maxExecutionsCount);
        callback();
    }
};
