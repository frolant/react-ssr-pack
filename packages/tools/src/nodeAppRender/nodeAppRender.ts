// @ts-ignore - REMOVE AFTER UPDATE TYPES FOR REACT 18
import { renderToPipeableStream } from 'react-dom/server';

import { getAddedEffectsDataItemsCount, setEffectsDataItemsStatusesToProcessed, getEffectsFilePathsData, resetEffectsData } from '../effectsDataService';

import { getStringFromPipeableStream } from './utils';

type TNodeAppRenderResult = Promise<{
    maxIterationsCount: number;
    executedIterationsCount: number;
    effectsFilePaths: string[];
    content: string;
}>;

type TNodeAppRender = (application: () => any, onRendered: () => void, maxIterationsCount?: number) => TNodeAppRenderResult;

const DEFAULT_MAX_ITERATIONS_COUNT = 8;

export const nodeAppRender: TNodeAppRender = async (application, onRendered, maxIterationsCount = DEFAULT_MAX_ITERATIONS_COUNT) => {
    let executedIterationsCount = 1;

    const render = async (): TNodeAppRenderResult => {
        const App = await application();

        const stream = await renderToPipeableStream(App);
        const content = await getStringFromPipeableStream(stream);

        await onRendered();

        const addedEffectsCount = getAddedEffectsDataItemsCount();
        setEffectsDataItemsStatusesToProcessed();

        if (addedEffectsCount > 0 && executedIterationsCount < maxIterationsCount) {
            executedIterationsCount += 1;
            return render();
        }

        const effectsFilePaths = getEffectsFilePathsData();

        resetEffectsData();

        return {
            maxIterationsCount,
            executedIterationsCount,
            effectsFilePaths,
            content
        };
    };

    return render();
};
