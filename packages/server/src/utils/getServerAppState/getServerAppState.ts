import { getStateScriptContent } from './utils';

import { stateAddressPart } from '../../constants';

import type { IStateCacheService } from '../../types';

export const getServerAppState = async (stateCacheService: IStateCacheService, { originalUrl = '' }): Promise<string> => {
    const id = originalUrl.replace(stateAddressPart, '');
    const state = await stateCacheService.getItem(id);

    return getStateScriptContent(state);
};
