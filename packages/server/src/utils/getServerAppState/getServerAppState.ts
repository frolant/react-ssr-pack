import stateCacheService from '../../services/stateCacheService';

import { getStateScriptContent } from './utils';

import { stateAddressPart } from '../../constants';

export const getServerAppState = ({ originalUrl = '' }): string => {
    const id = originalUrl.replace(stateAddressPart, '');
    const state = stateCacheService.get(id);

    state && stateCacheService.delete(id);

    return getStateScriptContent(state);
};
