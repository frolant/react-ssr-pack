import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from 'hooks/useAppSelector';
import { loadMenuRequest } from 'store/actions';

type TUseAppState = () => {
    isAppReady: boolean;
    isLoading: boolean;
};

export const useAppState: TUseAppState = () => {
    const dispatch = useDispatch();

    const isLoadingProcess = useAppSelector((state) => state.request.process);
    const isMenuDataLoaded = !!useAppSelector((state) => state.content.menu);

    useEffect(() => {
        if (!isMenuDataLoaded) {
            dispatch(loadMenuRequest());
        }
    }, [dispatch, isMenuDataLoaded]);

    return {
        isAppReady: isMenuDataLoaded,
        isLoading: isLoadingProcess
    };
};
