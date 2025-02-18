import { forceExitErrorText } from './constants';

export const debounce = <T extends (...args: any[]) => any>(fn: T, time: number): (...args: any) => void => {
    let timeout: NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), time);
    };
};

export const logForceExitError = (queue: string[][]): void => {
    console.error(forceExitErrorText.join('\n'), '\n', queue);
};
