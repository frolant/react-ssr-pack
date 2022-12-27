import type { FC } from 'react';

export type TRenderAppConfig<OptionsExtension = Record<string, unknown>> = OptionsExtension & {
    app: FC;
};

export interface TRenderServerAppRequestOptions {
    url: string;
    host: string;
    origin: string;
    protocol: string;
}

type TRenderServerAppOptions<OptionsExtension = Record<string, unknown>> = TRenderAppConfig<OptionsExtension> & {
    request: TRenderServerAppRequestOptions;
};

export interface IRenderServerAppResult {
    maxIterationsCount: number;
    executedIterationsCount: number;
    effectsFilePaths: string[];
    responseLocation?: string;
    responseCode?: number;
    content: string;
    head: string;
}

export type TServerAppRender<OptionsExtension = Record<string, unknown>> = (
    options: TRenderServerAppOptions<OptionsExtension>
) => Promise<IRenderServerAppResult>;

export type TClientAppRender<OptionsExtension = Record<string, unknown>> = (
    options: TRenderAppConfig<OptionsExtension>
) => void;
