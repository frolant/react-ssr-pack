import { useMemo } from 'react';

export type TDependencies = any[];

export interface IEffectsDataItem {
    getFilePath: () => string;
    isDependenciesChanged: (dependencies: TDependencies) => boolean;
}

type TEffectsData = Map<string, IEffectsDataItem>;

export type TEffectsDataItems = IEffectsDataItem[];

export const createEffectsData = (): TEffectsData => new Map();

export const createEffectsDataItem = (id: string, filePath: string, deps: TDependencies): IEffectsDataItem => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    const getDependenciesChangesCheckResult = (dependencies: TDependencies): number => useMemo(Math.random, dependencies);

    const effectData = {
        id,
        filePath,
        dependenciesId: getDependenciesChangesCheckResult(deps)
    };

    return {
        getFilePath: () => effectData.filePath,
        isDependenciesChanged: (dependencies) => {
            const updatedDepsCheckResult = getDependenciesChangesCheckResult(dependencies);
            const result = effectData.dependenciesId !== updatedDepsCheckResult;
            effectData.dependenciesId = updatedDepsCheckResult;

            console.warn('isDependenciesChanged', result);

            return result;
        }
    };
};
