import { checkStateIdExistence, addStateDataItem, getStateDataItem } from '../stateDataService';

export type TNodeStateData = [
    state: any,
    setState: (value: any) => void
];

export const nodeUseState = (id: string, value: any): TNodeStateData => {
    if (!checkStateIdExistence(id)) {
        addStateDataItem(id, value);
    }

    const stateDataItem = getStateDataItem(id);

    return [
        stateDataItem.getValue(),
        stateDataItem.setValue
    ];
};
