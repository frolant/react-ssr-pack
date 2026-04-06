import { getWaitingEffectsDataItemsCount, getEffectsFilePathsData, processEffectsStatusesAfterRender, resetEffectsData } from '../effectsDataService';
import { resetStateData, resetStateUpdateStatus, getStateUpdateStatus } from '../stateDataService';
import { getStringFromComponent } from './utils';

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

        const content = await getStringFromComponent(App);

        await onRendered();

        const isStateUpdated = getStateUpdateStatus();

        resetStateUpdateStatus();
        processEffectsStatusesAfterRender();

        const waitingEffectsCount = getWaitingEffectsDataItemsCount();

        if (executedIterationsCount < maxIterationsCount && (isStateUpdated || waitingEffectsCount > 0)) {
            executedIterationsCount += 1;
            return render();
        } else {
            const effectsFilePaths = getEffectsFilePathsData();
            resetEffectsData();
            resetStateData();
            return {
                maxIterationsCount,
                executedIterationsCount,
                effectsFilePaths,
                content
            };
        }
    };

    return render();
};
