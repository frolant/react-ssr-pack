import type { IDocumentData, IWindowData, INavigatorData, ILocalStorageData } from './types';

const commonWindowAndDocumentData: IDocumentData = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => null
};

export const serverSideRenderingUserAgent = 'bjsd392jkbwebj4HkLsG341ged';

export const navigatorData: INavigatorData = {
    cookieEnabled: false,
    userAgent: serverSideRenderingUserAgent
};

export const localStorageData: ILocalStorageData = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
};

export const documentData: IDocumentData = {
    body: {
        style: {},
        classList: {
            add: () => {},
            remove: () => {}
        },
        appendChild: () => null,
        removeChild: () => null
    },
    head: {
        appendChild: () => null,
        removeChild: () => null
    },
    createElement: () => ({} as any),
    getElementById: () => null,
    getElementsByClassName: () => ([] as any),
    getElementsByTagName: () => ([] as any),
    querySelector: () => null as any,
    ...commonWindowAndDocumentData
};

export const windowData: IWindowData = {
    document: documentData,
    navigator: navigatorData,
    localStorage: localStorageData,
    location: {
        reload: () => {}
    },
    console: {
        error: () => {},
        warn: () => {},
        log: () => {}
    },
    URL: {
        createObjectURL: () => null as any,
        revokeObjectURL: () => null as any
    },
    // @ts-ignore
    open: () => null,
    print: () => null,
    requestAnimationFrame: () => null,
    scrollTo: () => {},
    getComputedStyle: () => ({} as CSSStyleDeclaration),
    ...commonWindowAndDocumentData
};
