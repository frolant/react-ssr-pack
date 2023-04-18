const debounce = <T extends (...args: any[]) => any>(fn: T, time: number): (...args: any) => void => {
    let timeout: NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), time);
    };
};

export default debounce;
