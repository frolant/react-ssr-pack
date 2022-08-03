import type { FC } from 'react';
import type { ReducersMapObject } from 'redux';

export interface IRenderAppConfig {
    app: FC;
    reducers: ReducersMapObject<any, any>;
    sagas: Array<() => Generator>;
    analyticsEvents?: any;
}

interface IRenderServerAppOptions extends IRenderAppConfig {
    url: string;
}

interface IRenderServerAppResult {
    maxIterationsCount: number;
    executedIterationsCount: number;
    effectsFilePaths: string[];
    responseCode?: number;
    headData: any;
    content: string;
}

export type TServerAppRender = (options: IRenderServerAppOptions) => Promise<IRenderServerAppResult>;

export type TClientAppRender = (options: IRenderAppConfig) => void;
