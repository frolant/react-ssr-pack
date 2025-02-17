import { createContext, useContext, useRef } from 'react';

import type { FC, ReactNode } from 'react';

interface IUseCreatePortalsContext {
    getPortalsData: () => ReactNode[];
    addPortalData: (data: ReactNode) => void;
}

interface IPortalsContextProvider {
    children: ReactNode;
    value: ReactNode[];
}

const PortalsContext = createContext<IUseCreatePortalsContext>(null);

const useCreatePortalsContext = (initialValue: ReactNode[] = []): IUseCreatePortalsContext => {
    const portalsData = useRef<ReactNode[]>(initialValue);

    return {
        getPortalsData: () => {
            return portalsData.current;
        },
        addPortalData: (data: ReactNode) => {
            data && portalsData.current.push(data);
        }
    };
};

export const usePortalsContext = (): IUseCreatePortalsContext => useContext(PortalsContext);

export const PortalsContextProvider: FC<IPortalsContextProvider> = ({ children, value: initialValue }) => {
    const context = useCreatePortalsContext(initialValue);
    return (
        <PortalsContext.Provider value={context}>
            {children}
        </PortalsContext.Provider>
    );
};
