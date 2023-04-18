import { localStorageData } from './bypassData';

import type { ILocalStorageData } from './types';

type TGetLocalStorageData = (isRunInBrowser: boolean) => ILocalStorageData;

const getLocalStorageData: TGetLocalStorageData = (isRunInBrowser) => (isRunInBrowser ? localStorage : localStorageData);

export default getLocalStorageData;
