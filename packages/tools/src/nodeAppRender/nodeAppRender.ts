// @ts-ignore - REMOVE AFTER UPDATE TYPES FOR REACT 18
import { renderToPipeableStream } from 'react-dom/server';

import { getWaitingEffectsDataItemsCount, getEffectsFilePathsData, resetEffectsStatuses, resetEffectsData } from '../effectsDataService';

import { getStringFromPipeableStream } from './utils';

export interface INodeAppRenderResultData {
    maxIterationsCount: number;
    executedIterationsCount: number;
    effectsFilePaths: string[];
    content: string;
}

type TNodeAppRenderResult = Promise<INodeAppRenderResultData>;

type TNodeAppRender = (application: () => any, onRendered: () => void, maxIterationsCount?: number) => TNodeAppRenderResult;

const DEFAULT_MAX_ITERATIONS_COUNT = 8;

export const nodeAppRender: TNodeAppRender = async (application, onRendered, maxIterationsCount = DEFAULT_MAX_ITERATIONS_COUNT) => {
    let executedIterationsCount = 1;

    const render = async (): TNodeAppRenderResult => {
        const App = await application();

        const stream = await renderToPipeableStream(App);
        const content = await getStringFromPipeableStream(stream);

        await onRendered();

        resetEffectsStatuses();

        const waitingEffectsCount = getWaitingEffectsDataItemsCount();

        if (waitingEffectsCount > 0 && executedIterationsCount < maxIterationsCount) {
            executedIterationsCount += 1;
            return render();
        }

        const effectsFilePaths = getEffectsFilePathsData();

        return {
            maxIterationsCount,
            executedIterationsCount,
            effectsFilePaths,
            content
        };
    };

    const runRenderingProcess = async (): TNodeAppRenderResult => {
        const result = await render();
        resetEffectsData();
        return result;
    };

    return runRenderingProcess();
};
