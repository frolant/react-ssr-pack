import portalsDataProvider from '../../services/portalsDataProvider';

import type { FC } from 'react';

const PortalsCollection: FC = () => {
    const portalsData = portalsDataProvider.get();
    portalsDataProvider.clear();

    return portalsData.length ? (
        <>
            {portalsData.map((item) => item)}
        </>
    ) : null;
};

export default PortalsCollection;
