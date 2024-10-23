import { getStateScriptContent } from './utils';

import type { IStateCacheService } from '../../types';

export const getServerAppState = async (stateCacheService: IStateCacheService, url: string): Promise<string> => {
    const state = await stateCacheService.getItem(url);
    return getStateScriptContent(state);
};
