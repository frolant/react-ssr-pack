import React, { RefObject } from 'react';
import { createPortal } from 'react-dom';

import { isRunInBrowser, getPortalOptions, updatePortalsData } from './utils';

export interface IPortalProps {
    children: any;
    containerId?: string;
    containerRef?: RefObject<HTMLElement>;
}

const Portal: React.FC<IPortalProps> = (props) => {
    return isRunInBrowser ? createPortal(...getPortalOptions(props)) : updatePortalsData(props);
};

export default Portal;
