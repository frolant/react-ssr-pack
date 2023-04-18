import React from 'react';
import { Helmet } from 'react-helmet-async';

import type { ReactNode } from 'react';

export interface IHeadDataSwitchContainerProps {
    title?: string;
    description?: string;
    keywords?: string;
    children?: ReactNode;
}

const HeadDataSwitchContainer: React.FC<IHeadDataSwitchContainerProps> = ({
    title,
    description,
    keywords,
    children
}) => {
    return (
        <>
            <Helmet>
                {!!title && (
                    <title>
                        {title}
                    </title>
                )}

                {!!description && (
                    <meta
                        name="description"
                        content={description}
                    />
                )}

                {!!keywords && (
                    <meta
                        name="keywords"
                        content={keywords}
                    />
                )}
            </Helmet>

            {children}
        </>
    );
};

export default HeadDataSwitchContainer;
