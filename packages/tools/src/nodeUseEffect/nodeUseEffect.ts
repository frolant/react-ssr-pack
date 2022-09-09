import { addEffectsDataItem, getEffectsDataItem } from '../services/effectsDataService';

import type { TDependencies } from '../services/effectsDataService';

export const nodeUseEffect = (callback: () => any, dependencies: TDependencies, effectId: string, effectFilePath: string): void => {
    const existingEffectData = getEffectsDataItem(effectId);

    if (!existingEffectData) {
        addEffectsDataItem(effectId, effectFilePath, dependencies);
        callback();
    } else if (existingEffectData.isDependenciesChanged(dependencies)) {
        callback();
    }
};
