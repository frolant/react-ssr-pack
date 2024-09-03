import { getStateScriptContent } from './utils';

import { stateAddressPart } from '../../constants';

import type { IStateCacheService } from '../../services/stateCacheService';

const getServerAppState = (cacheService: IStateCacheService, { originalUrl = '' }): string => {
    const id = originalUrl.replace(stateAddressPart, '');
    const state = cacheService.getItem(id);

    return getStateScriptContent(state);
};

export const createGetServerAppStateHandler = (cacheService: IStateCacheService) => {
    return (request: any) => getServerAppState(cacheService, request);
};
