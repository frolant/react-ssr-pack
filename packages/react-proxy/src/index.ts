// @ts-nocheck
import React from 'react';

import { nodeUseEffect, getNotIdentifiedEffectData } from '@react-ssr-pack/tools';

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
    useState,
    useSyncExternalStore,
    useTransition,
    version
} = React;

export const useEffect: TUseEffect = (callback, ...args) => {
    const data = args.length < 4 ? getNotIdentifiedEffectData() : args.slice(-3);
    nodeUseEffect(callback, ...data);
};

export const useLayoutEffect: TUseEffect = () => {};

export default React;
