import { addEffectsDataItem, getEffectsDataItem } from '../services/effectsDataService';

import type { TDependencies } from '../services/effectsDataService';

type TNodeUseEffect = (
    callback: () => any,
    dependenciesOrEffectId: TDependencies | null,
    effectIdOrEffectFilePath: string,
    effectFilePathOrNone: string | null
) => void;

export const nodeUseEffect: TNodeUseEffect = async (callback, dependencies, effectId, effectFilePath) => {
    const existingEffectData = await getEffectsDataItem(effectId);

    if (!existingEffectData) {
        await addEffectsDataItem(effectId, effectFilePath, dependencies);
        await callback();
    } else if (!dependencies) {
        await callback();
    } else if (dependencies.length && existingEffectData.isDependenciesChanged(dependencies)) {
        // console.warn(effectFilePath, dependencies);
        await existingEffectData.setExecutedStatus();
        await callback();
    }
};
