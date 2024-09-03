import { getStateScriptContent } from './utils';

import { stateAddressPart } from '../../constants';

import type { IStateCacheService } from '../../services/stateCacheService';

export const getServerAppState = (stateCacheService: IStateCacheService, { originalUrl = '' }): string => {
    const id = originalUrl.replace(stateAddressPart, '');
    const state = stateCacheService.getItem(id);

    return getStateScriptContent(state);
};
