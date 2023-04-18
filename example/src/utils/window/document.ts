import { documentData } from './bypassData';

import type { IDocumentData } from './types';

type TGetDocumentData = (isRunInBrowser: boolean) => IDocumentData;

const getDocumentData: TGetDocumentData = (isRunInBrowser) => (isRunInBrowser ? document : documentData);

export default getDocumentData;
