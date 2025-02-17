import { createPortal } from 'react-dom';

import { isRunInBrowser, getPortalOptions } from './utils';

import { usePortalsContext } from './PortalsContext';

import type { FC, RefObject } from 'react';

export interface IPortalProps {
    children: any;
    containerId?: string;
    containerRef?: RefObject<HTMLElement>;
}

type TPortal = FC<IPortalProps>;

const BrowserPortal: TPortal = (props) => {
    return createPortal(...getPortalOptions(props));
};

const NodePortal: TPortal = (props) => {
    const { addPortalData } = usePortalsContext();
    addPortalData(props.children);
    return null;
};

export default isRunInBrowser ? BrowserPortal : NodePortal;
