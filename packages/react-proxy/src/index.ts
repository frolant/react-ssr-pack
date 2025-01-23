// @ts-nocheck
import React, { useState as originalUseState } from 'react';

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

export const useState = (...args): TNodeStateData => {
    const isNeedProxy = args.length > 1;
    const stateHandler = isNeedProxy ? nodeUseState : originalUseState;
    const data = isNeedProxy && args.length < 3 ? [ undefined, ...args ] : args;
    return stateHandler(...data);
};

export default React;
