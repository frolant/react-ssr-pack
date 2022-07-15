import { ReactNode } from 'react';

export interface IPortalsDataProvider {
    get: () => ReactNode[];
    add: (data: ReactNode) => void;
    clear: () => void;
}

const createPortalsDataProvider = (): IPortalsDataProvider => {
    let data: ReactNode[] = [];

    return {
        get: () => data,
        add: (item: ReactNode) => {
            data.push(item);
        },
        clear: () => {
            data = [];
        }
    };
};

export default createPortalsDataProvider();
