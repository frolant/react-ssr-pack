import { createPortal } from 'react-dom';

import { isRunInBrowser, getPortalOptions, updatePortalsData } from './utils';

import type { FC, RefObject } from 'react';

export interface IPortalProps {
    children: any;
    containerId?: string;
    containerRef?: RefObject<HTMLElement>;
}

const Portal: FC<IPortalProps> = (props) => {
    return isRunInBrowser ? createPortal(...getPortalOptions(props)) : updatePortalsData(props);
};

export default Portal;
