import React, { Suspense } from 'react';

import { useAppState } from './hooks';

import type { ReactNode } from 'react';

import FallbackContent from './components/FallbackContent';
import Loading from './components/Loading';

interface IProps {
    contentRef?: HTMLElement;
    children: ReactNode;
}

const AppInitializationContainer: React.FC<IProps> = ({
    contentRef,
    children: App
}) => {
    const { isAppReady, isLoading } = useAppState();

    return isAppReady ? (
        <Suspense fallback={(
            <>
                <Loading />
                <FallbackContent contentRef={contentRef}/>
            </>
        )}>
            {isLoading && <Loading />}
            {App}
        </Suspense>
    ) : <FallbackContent contentRef={contentRef} />;
};

export default AppInitializationContainer;
