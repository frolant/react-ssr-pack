import { isRunInNode } from 'utils/window';

type TLog = (message: string) => void;

const messagePrefix = '\u001b[1m\x1b[90mapp\x1b[0m\x1b[90m ';
const messagePostfix = '\x1b[0m';

const log: TLog = (message) => {
    if (__IS_TRACE_SSR_MODE__ && isRunInNode) {
        console.log(`${messagePrefix}${message}${messagePostfix}`); // eslint-disable-line no-console
    }
};

export default log;
