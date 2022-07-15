export enum EffectStatus {
    added = 'added',
    processed = 'processed'
}

interface IEffectsDataItem {
    getFilePath: () => string;
    getStatus: () => EffectStatus;
    setStatusProcessed: () => void;
}

type TEffectsData = Map<string, IEffectsDataItem>;

export type TEffectsDataItems = IEffectsDataItem[];

export const createEffectsData = (): TEffectsData => new Map();

export const createEffectsDataItem = (effectId: string, effectFilePath: string): IEffectsDataItem => {
    const effectData = {
        id: effectId,
        filePath: effectFilePath,
        status: EffectStatus.added
    };

    return {
        getFilePath: () => effectData.filePath,
        getStatus: () => effectData.status,
        setStatusProcessed: () => {
            effectData.status = EffectStatus.processed;
        }
    };
};
