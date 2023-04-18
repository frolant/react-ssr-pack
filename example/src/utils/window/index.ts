import isRunInBrowserCondition from './isRunInBrowser';
import getLocalStorageData from './localStorage';
import getNavigatorData from './navigator';
import getDocumentData from './document';
import getWindowData from './window';

export { serverSideRenderingUserAgent } from './bypassData';

export const isRunInBrowser = isRunInBrowserCondition;
export const isRunInNode = !isRunInBrowser;

export const localStorage = getLocalStorageData(isRunInBrowser);
export const navigator = getNavigatorData(isRunInBrowser);
export const document = getDocumentData(isRunInBrowser);
export const window = getWindowData(isRunInBrowser);
