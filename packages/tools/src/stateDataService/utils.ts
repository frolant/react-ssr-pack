import { setStateUpdateStatusToTrue } from './stateUpdateStatusService';

export interface IStateDataItem {
    getValue: () => any;
    setValue: (value: any) => void;
}

type TStateData = Map<string, IStateDataItem>;

export const createStateData = (): TStateData => new Map();

export const createStateDataItem = (stateId: string, stateValue: any): IStateDataItem => {
    const stateData = {
        id: stateId,
        value: stateValue
    };

    return {
        getValue: () => stateData.value,
        setValue: (value) => {
            stateData.value = value;
            setStateUpdateStatusToTrue();
        }
    };
};
