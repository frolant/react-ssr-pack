import React from 'react';

import portalsDataProvider from '../../services/portalsDataProvider';

const PortalsCollection: React.FC = () => {
    const portalsData = portalsDataProvider.get();
    portalsDataProvider.clear();

    return portalsData.length ? (
        <>
            {portalsData.map((item) => item)}
        </>
    ) : null;
};

export default PortalsCollection;
