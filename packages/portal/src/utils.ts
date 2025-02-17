import type { ReactElement } from 'react';

import type { IPortalProps } from './Portal';

type TGetPortalOptions = (props: IPortalProps) => ([
    ReactElement | ReactElement[],
    Element
]);

type TGetPortalElement = (containerId: string) => HTMLElement;

export const isRunInBrowser = typeof window !== 'undefined';

const getPortalElement: TGetPortalElement = (containerId) => {
    return isRunInBrowser ? document.getElementById(containerId) : null;
};

export const getPortalOptions: TGetPortalOptions = ({ children, containerId = 'root', containerRef }) => ([
    children,
    containerRef?.current ? containerRef.current : getPortalElement(containerId)
]);
