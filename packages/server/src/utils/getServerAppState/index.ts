import { getServerAppState } from './getServerAppState';

import type { IStateCacheService } from '../../types';

export default (stateCacheService: IStateCacheService) => {
    return async (url: string) => getServerAppState(stateCacheService, url);
};
