import { checkStateIdExistence, addStateDataItem, getStateDataItem } from '../stateDataService';

export type TNodeStateData = [
    state: any,
    setState: (value: any) => void
];

export const nodeUseState = (defaultState: any, id: string): TNodeStateData => {
    if (!checkStateIdExistence(id)) {
        addStateDataItem(id, defaultState);
    }

    const stateDataItem = getStateDataItem(id);

    return [
        stateDataItem.getValue(),
        stateDataItem.setValue
    ];
};
