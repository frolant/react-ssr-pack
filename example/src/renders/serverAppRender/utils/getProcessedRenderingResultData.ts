import { httpCodes } from 'constants/httpCodes';
import { ROUTES } from 'constants/routes';

import type { INodeAppRenderResultData } from '@react-ssr-pack/tools';
import type { StaticRouterContext as IRouterContext } from 'react-router';
import type { IHeadDataSwitchContainerContext } from 'components/HeadDataSwitchContainer';
import type { IRenderServerAppResult } from '@react-ssr-pack/server';
import type { Store as TStore } from 'redux';

interface TGetHttpCodeDataResult {
    code: httpCodes;
    location: string;
}

type TGetRedirectCodeByRouter = (url: string) => httpCodes;
type TGetProcessedCodeData = (context: IRouterContext) => TGetHttpCodeDataResult;

interface IGetProcessedRenderingResultData {
    renderingResult: INodeAppRenderResultData;
    headDataContext: IHeadDataSwitchContainerContext;
    routerContext: IRouterContext;
    initialState: TStore;
}

type TGetProcessedRenderingResultData = (data: IGetProcessedRenderingResultData) => IRenderServerAppResult;

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

const getProcessedState = (state: TStore): string => {
    return `
    <script type="text/javascript">window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')};</script>`;
};

export const getProcessedRenderingResultData: TGetProcessedRenderingResultData = ({
    renderingResult,
    headDataContext,
    routerContext,
    initialState
}) => {
    const { content, ...data } = renderingResult;
    const { helmet: { title, meta, link, script } } = headDataContext;
    const { code, location } = getProcessedLocationData(routerContext);

    return {
        ...data,
        head: `${title.toString()}${meta.toString()}${link.toString()}${script.toString()}`,
        content: content.replace(/<!-- -->|<!--\$-->|<!--\/\$-->/g, ''),
        bottom: getProcessedState(initialState),
        responseLocation: location,
        responseCode: code
    };
};
