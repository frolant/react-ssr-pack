import path from 'path';

import { logMessage } from './handlers';

import { traceMessageParts } from './constants';

type TLogExecution = (execIterationsCount: number, maxIterationsCount: number, effectsFilePaths: string[]) => void;
type TLogEffectPathItem = (path: string, index: number) => void;

const projectRootPath = process.cwd();

const logEffectPathItem: TLogEffectPathItem = (itemPath, itemIndex) => {
    const index = `${itemIndex + 1}`.padStart(2, '0');
    const localPath = path.join(projectRootPath, itemPath).split(path.sep).join(path.posix.sep);
    logMessage(`${traceMessageParts.index}${index}${traceMessageParts.styleEnd} at file:///${localPath}`);
};

export const logTrace: TLogExecution = (executedIterationsCount, maxIterationsCount, effectsFilePaths) => {
    logMessage(`${traceMessageParts.iterations}${executedIterationsCount}${traceMessageParts.styleEnd} (max ${maxIterationsCount})`);
    logMessage(`${traceMessageParts.effects}${effectsFilePaths.length}${traceMessageParts.styleEnd}`);

    if (effectsFilePaths[0]) {
        logMessage('order of execution effects on files:');
        effectsFilePaths.map(logEffectPathItem);
    }

    logMessage();
};
