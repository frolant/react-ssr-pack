let IS_STATE_UPDATED = false;

export const setStateUpdateStatusToTrue = (): void => {
    IS_STATE_UPDATED = true;
};

export const getStateUpdateStatus = (): boolean => {
    return IS_STATE_UPDATED;
};

export const resetStateUpdateStatus = (): void => {
    IS_STATE_UPDATED = false;
};
