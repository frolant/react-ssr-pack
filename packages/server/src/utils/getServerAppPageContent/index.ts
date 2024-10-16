import { getServerAppPageContent } from './getServerAppPageContent';

import type { IStateCacheService } from '../../types';
import type { IGetServerAppPageContentOptions } from './getServerAppPageContent';

export default (cacheService: IStateCacheService) => {
    return (options: IGetServerAppPageContentOptions) => getServerAppPageContent(cacheService, options);
};
