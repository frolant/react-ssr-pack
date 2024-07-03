export enum EffectStatus {
    waiting = 'waiting',
    finished = 'finished'
}

interface IEffectsDataItem {
    getFilePath: () => string;
    getStatus: () => EffectStatus;
    getExecutionsCount: () => number;
    setStatusToFinished: () => void;
    increaseExecutionsCount: () => void;
}

type TEffectsData = Map<string, IEffectsDataItem>;

export type TEffectsDataItems = IEffectsDataItem[];

export const createEffectsData = (): TEffectsData => new Map();

export const createEffectsDataItem = (effectId: string, effectFilePath: string): IEffectsDataItem => {
    const effectData = {
        id: effectId,
        filePath: effectFilePath,
        status: EffectStatus.waiting,
        executionsCount: 0
    };

    return {
        getFilePath: () => effectData.filePath,
        getStatus: () => effectData.status,
        getExecutionsCount: () => effectData.executionsCount,
        setStatusToFinished: () => {
            effectData.status = EffectStatus.finished;
        },
        increaseExecutionsCount: () => {
            effectData.executionsCount = effectData.executionsCount + 1;
        }
    };
};
