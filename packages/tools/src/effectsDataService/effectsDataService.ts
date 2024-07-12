import { createEffectsData, createEffectsDataItem, EffectStatus } from './utils';
import type { TEffectsDataItems } from './utils';

let EFFECTS_DATA = createEffectsData();
let NOT_IDENTIFIED_EFFECTS_COUNTER = 0;

const getEffectsDataItems = (): TEffectsDataItems => Array.from(EFFECTS_DATA.values());

const resetNotIdentifiedEffectsData = (): void => {
    NOT_IDENTIFIED_EFFECTS_COUNTER = 0;
};

export const getNotIdentifiedEffectData = (): string[] => {
    NOT_IDENTIFIED_EFFECTS_COUNTER = NOT_IDENTIFIED_EFFECTS_COUNTER + 1;
    return [
        `not-identified-effect-${NOT_IDENTIFIED_EFFECTS_COUNTER.toString()}`,
        '1',
        '/'
    ];
};

export const checkEffectIdExistence = (effectId: string): boolean => {
    return !!EFFECTS_DATA.get(effectId);
};

export const addEffectsDataItem = (effectId: string, effectFilePath: string): void => {
    const effectsDataItem = createEffectsDataItem(effectId, effectFilePath);
    EFFECTS_DATA.set(effectId, effectsDataItem);
};

export const checkEffectForNeedExecution = (effectId: string, maxExecutionsCount: number): boolean => {
    const effect = EFFECTS_DATA.get(effectId);
    const isWaiting = effect.getStatus() !== EffectStatus.finished;
    return isWaiting && effect.getExecutionsCount() < maxExecutionsCount;
};

export const processExecutionCount = (effectId: string, maxExecutionsCount: number): void => {
    const effect = EFFECTS_DATA.get(effectId);

    if (effect.getExecutionsCount() < maxExecutionsCount) {
        effect.getStatus() === EffectStatus.waiting && effect.increaseExecutionsCount();
        effect.setStatusToExecuted();
    } else {
        effect.setStatusToFinished();
    }
};

export const getWaitingEffectsDataItemsCount = (): number => {
    return getEffectsDataItems().filter((item) => item.getStatus() === EffectStatus.waiting).length;
};

export const getEffectsFilePathsData = (): string[] => {
    return getEffectsDataItems().map((item) => item.getFilePath());
};

export const resetEffectsStatuses = (): void => {
    resetNotIdentifiedEffectsData();
    getEffectsDataItems().forEach((item) => {
        if (item.getStatus() === EffectStatus.executed) {
            item.setStatusToWaiting();
        }
    });
};

export const resetEffectsData = (): void => {
    EFFECTS_DATA = createEffectsData();
};
