export enum EffectStatus {
    waiting = 'waiting',
    executed = 'executed',
    finished = 'finished'
}

interface IEffectsDataItem {
    getFilePath: () => string;
    getStatus: () => EffectStatus;
    getExecutionsCount: () => number;
    setStatusToWaiting: () => void;
    setStatusToExecuted: () => void;
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
        setStatusToWaiting: () => {
            effectData.status = EffectStatus.waiting;
        },
        setStatusToExecuted: () => {
            effectData.status = EffectStatus.executed;
        },
        setStatusToFinished: () => {
            effectData.status = EffectStatus.finished;
        },
        increaseExecutionsCount: () => {
            effectData.executionsCount = effectData.executionsCount + 1;
        }
    };
};
