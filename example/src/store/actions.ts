import { createAction } from 'redux-actions';

import type { IMenuItem } from './types';

export const requestProcess = createAction<Record<string, any>>('REQUEST_PROCESS');
export const requestSuccess = createAction('REQUEST_SUCCESS');
export const requestError = createAction<Error>('REQUEST_ERROR');

export const loadMenuRequest = createAction('LOAD_MENU_REQUEST');
export const loadMenuSuccess = createAction<IMenuItem[]>('LOAD_MENU_SUCCESS');

export const loadPageRequest = createAction<string>('LOAD_PAGE_REQUEST');
export const loadPageSuccess = createAction<Record<string, any>>('LOAD_PAGE_SUCCESS');
