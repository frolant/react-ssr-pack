import { getServerAppState } from './getServerAppState';

import type { IStateCacheService } from '../../types';

export default (stateCacheService: IStateCacheService) => {
    return async (request: any) => getServerAppState(stateCacheService, request);
};
