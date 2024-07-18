import stateCacheService from '../../services/stateCacheService';

import { getStateScriptContent } from './utils';

import { stateAddressPart } from '../../constants';

export const getServerAppState = ({ originalUrl = '' }): string => {
    const id = originalUrl.replace(stateAddressPart, '');
    const state = stateCacheService.getItem(id);

    return getStateScriptContent(state);
};
