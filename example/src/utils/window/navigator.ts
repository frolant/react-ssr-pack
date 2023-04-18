import { navigatorData } from './bypassData';

import type { INavigatorData } from './types';

type TGetNavigatorData = (isRunInBrowser: boolean) => INavigatorData;

const getNavigatorData: TGetNavigatorData = (isRunInBrowser) => (isRunInBrowser ? navigator : navigatorData);

export default getNavigatorData;
