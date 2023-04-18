import { useSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import { IRootReducer } from 'store';

export const useAppSelector: TypedUseSelectorHook<IRootReducer> = useSelector;
