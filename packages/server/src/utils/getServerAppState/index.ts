import { getServerAppState } from './getServerAppState';

import type { IStateCacheService } from '../../services/stateCacheService';

export default (stateCacheService: IStateCacheService) => {
    return (request: any) => getServerAppState(stateCacheService, request);
};
