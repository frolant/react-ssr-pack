import React, { useState, useEffect } from 'react';

import HeadDataSwitchContainer from 'components/HeadDataSwitchContainer';

import styles from './MainPage.scss';

import { pageData } from './constants';

const MainPage: React.FC = () => {
    const [ linkContent, setLinkContent ] = useState<string>();

    // For useState data storage test on SSR after re-rendering
    useEffect(() => {
        !linkContent && setLinkContent('See on github.com');
    }, [linkContent]);

    return (
        <HeadDataSwitchContainer
            title={pageData.title}
            description={pageData.description}
            keywords={pageData.keywords}
        >
            <div className={styles.mainPage}>
                <h1>
                    {pageData.title}
                </h1>

                {pageData.content.map((paragraph, key) => (
                    <p key={key}>
                        {paragraph}
                    </p>
                ))}

                <a
                    href="https://github.com/frolant/react-ssr-pack"
                    target="_blank"
                >
                    {linkContent}
                </a>

                <img
                    className={styles.mainPage__image}
                    src="/favicon-32x32.png"
                    alt="React SSR Pack"
                />
            </div>
        </HeadDataSwitchContainer>
    );
};

export default MainPage;
