import { windowData } from './bypassData';

import type { IWindowData } from './types';

type TGetWindowData = (isRunInBrowser: boolean) => IWindowData;

const getWindowData: TGetWindowData = (isRunInBrowser) => (isRunInBrowser ? window : windowData) as IWindowData;

export default getWindowData;
