import { httpCodes } from 'constants/httpCodes';
import { ROUTES } from 'constants/routes';

import type { INodeAppRenderResultData } from '@react-ssr-pack/tools';
import type { StaticRouterContext as IRouterContext } from 'react-router';
import type { IHeadDataSwitchContainerContext } from 'components/HeadDataSwitchContainer';
import type { IRenderServerAppResult } from '@react-ssr-pack/server';

interface TGetHttpCodeDataResult {
    code: httpCodes;
    location: string;
}

type TGetRedirectCodeByRouter = (url: string) => httpCodes;
type TGetProcessedCodeData = (context: IRouterContext) => TGetHttpCodeDataResult;

type TGetProcessedRenderingResultData = (
    data: INodeAppRenderResultData,
    routerContext: IRouterContext,
    headDataContext: IHeadDataSwitchContainerContext
) => IRenderServerAppResult;

const defaultHttpCode = httpCodes.Success;

const REDIRECT_ACTION_NAME = 'REPLACE';

const getRedirectCodeByRouter: TGetRedirectCodeByRouter = (url) => {
    return url === ROUTES.NOT_FOUND ? httpCodes.NotFound : httpCodes.TemporaryRedirect;
};

export const getProcessedLocationData: TGetProcessedCodeData = ({ action, url }) => {
    const isRouterRedirect = action === REDIRECT_ACTION_NAME;
    return {
        code: isRouterRedirect ? getRedirectCodeByRouter(url) : defaultHttpCode,
        location: isRouterRedirect && url ? url : null
    };
};

export const getProcessedRenderingResultData: TGetProcessedRenderingResultData = (renderingResult, routerContext, headDataContext) => {
    const { content, ...data } = renderingResult;
    const { helmet: { title, meta, link, script } } = headDataContext;
    const { code, location } = getProcessedLocationData(routerContext);

    return {
        ...data,
        head: `${title.toString()}${meta.toString()}${link.toString()}${script.toString()}`,
        content: content.replace(/<!-- -->|<!--\$-->|<!--\/\$-->/g, ''),
        responseLocation: location,
        responseCode: code
    };
};
