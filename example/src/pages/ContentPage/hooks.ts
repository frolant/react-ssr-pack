import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useAppSelector } from 'hooks/useAppSelector';

import { loadPageRequest } from 'store/actions';

import type { IPage } from 'store';

export const usePageData = (): IPage => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const prevPageId = useRef<string>('');

    const pagesData = useAppSelector((state) => state.content.pages);

    const pageId = pathname.replace('/', '');
    const isPageDataNotLoaded = !pagesData[pageId];
    const pageData = pagesData[isPageDataNotLoaded ? prevPageId.current : pageId] || {} as IPage;

    if (!isPageDataNotLoaded) {
        prevPageId.current = pageId;
    }

    useEffect(() => {
        if (isPageDataNotLoaded) {
            dispatch(loadPageRequest(pageId));
        }
    }, [dispatch, isPageDataNotLoaded, pageId]);

    return pageData;
};
