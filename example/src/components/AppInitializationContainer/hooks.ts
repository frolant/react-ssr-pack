import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { isRunInNode } from 'utils/window';
import { useAppSelector } from 'hooks/useAppSelector';
import { loadMenuRequest } from 'store/actions';

type TUseAppState = () => {
    isAppReady: boolean;
    isLoading: boolean;
};

export const useAppState: TUseAppState = () => {
    const [isNotFirstRender, setIsNotFirstRender] = useState(isRunInNode);
    const dispatch = useDispatch();

    const isMenuDataLoaded = !!useAppSelector((state) => state.content.menu);
    const isLoadingProcess = useAppSelector((state) => state.request.process);

    useEffect(() => {
        !isMenuDataLoaded && dispatch(loadMenuRequest());
        !isNotFirstRender && setIsNotFirstRender(true);
    }, [dispatch, isMenuDataLoaded, isNotFirstRender]);

    return {
        isAppReady: isNotFirstRender && isMenuDataLoaded,
        isLoading: isLoadingProcess
    };
};
