export enum EffectStatus {
    processed = 'processed',
    executed = 'executed'
}

export type TDependencies = unknown[];

export interface IEffectsDataItem {
    getFilePath: () => string;
    getStatus: () => EffectStatus;
    setExecutedStatus: () => void;
    setProcessedStatus: () => void;
    isDependenciesChanged: (dependencies: TDependencies) => boolean;
}

type TEffectsData = Map<string, IEffectsDataItem>;

export type TEffectsDataItems = IEffectsDataItem[];

export const createEffectsData = (): TEffectsData => new Map();

const isDependenciesChange = (prevDeps: TDependencies, nextDeps: TDependencies): boolean => {
    let result = false;
    prevDeps.forEach((item, key) => {
        if (String(item) !== String(nextDeps[key])) {
            result = true;
        }
    });
    return result;
};

export const createEffectsDataItem = (id: string, filePath: string, deps: TDependencies): IEffectsDataItem => {
    const effectData = {
        id,
        filePath,
        dependencies: deps,
        status: EffectStatus.executed
    };

    return {
        getFilePath: () => effectData.filePath,
        getStatus: () => effectData.status,
        setExecutedStatus: () => {
            effectData.status = EffectStatus.executed;
        },
        setProcessedStatus: () => {
            effectData.status = EffectStatus.processed;
        },
        isDependenciesChanged: (dependencies) => {
            const result = isDependenciesChange(effectData.dependencies, dependencies);
            effectData.dependencies = dependencies;
            return result;
        }
    };
};
