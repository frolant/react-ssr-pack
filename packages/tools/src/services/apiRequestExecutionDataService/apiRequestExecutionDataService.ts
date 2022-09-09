let API_REQUESTS_COUNT = 0;

export const registerApiRequestExecution = (): void => {
    API_REQUESTS_COUNT += 1;
};

export const getApiRequestsExecutionCount = (): number => {
    return API_REQUESTS_COUNT;
};

export const resetApiRequestsExecutionCount = (): void => {
    API_REQUESTS_COUNT = 0;
};
