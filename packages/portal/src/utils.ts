import portalsDataProvider from './services/portalsDataProvider/portalsDataProvider';

import type { ReactElement } from 'react';

import type { IPortalProps } from './Portal';

type TGetPortalOptions = (props: IPortalProps) => ([
    ReactElement | ReactElement[],
    Element
]);

type TGetPortalElement = (containerId: string) => HTMLElement;
type TUpdatePortalsData = (props: IPortalProps) => null;

export const isRunInBrowser = typeof window !== 'undefined';

const getPortalElement: TGetPortalElement = (containerId) => {
    return isRunInBrowser ? document.getElementById(containerId) : null;
};

export const getPortalOptions: TGetPortalOptions = ({ children, containerId = 'root', containerRef }) => ([
    children,
    containerRef?.current ? containerRef.current : getPortalElement(containerId)
]);

export const updatePortalsData: TUpdatePortalsData = ({ children }) => {
    portalsDataProvider.add(children);
    return null;
};
