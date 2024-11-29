// @ts-nocheck
import React from 'react';

import { nodeUseEffect, nodeUseState, getNotIdentifiedEffectData } from '@react-ssr-pack/tools';

import type { TNodeStateData } from '@react-ssr-pack/tools';

type TUseEffect = (callback: () => void) => void;

export const {
    Children,
    Component,
    Fragment,
    Profiler,
    PureComponent,
    StrictMode,
    Suspense,
    cloneElement,
    createContext,
    createElement,
    createFactory,
    createRef,
    forwardRef,
    isValidElement,
    lazy,
    memo,
    startTransition,
    unstable_act,
    useCallback,
    useContext,
    useDebugValue,
    useDeferredValue,
    useId,
    useImperativeHandle,
    useInsertionEffect,
    useMemo,
    useReducer,
    useRef,
    useSyncExternalStore,
    useTransition,
    version
} = React;

export const useEffect: TUseEffect = (callback, ...args) => {
    const data = args.length < 4 ? getNotIdentifiedEffectData() : args.slice(-3);
    nodeUseEffect(callback, ...data);
};

export const useLayoutEffect: TUseEffect = () => {};

export const useState = (id: string, value: any): TNodeStateData => {
    return nodeUseState(id, value);
};

export default React;
