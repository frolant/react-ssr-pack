import { usePortalsContext } from '../../PortalsContext';

import type { FC } from 'react';

const PortalsCollection: FC = () => {
    const { getPortalsData } = usePortalsContext();
    const portalsData = getPortalsData();

    return portalsData.length ? (
        <>
            {portalsData.map((item) => item)}
        </>
    ) : null;
};

export default PortalsCollection;
