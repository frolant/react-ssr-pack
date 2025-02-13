import { useState, useCallback, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import HeadDataSwitchContainer from 'components/HeadDataSwitchContainer';
import Modal from 'components/Modal';

import styles from './MainPage.scss';

import { ROUTES } from 'constants/routes';
import { pageData } from './constants';

import type { FC } from 'react';

const MainPage: FC = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const [ linkContent, setLinkContent ] = useState<string>();

    // For useState data storage test on SSR after re-rendering
    useEffect(() => {
        !linkContent && setLinkContent('See on github.com');
    }, [linkContent]);

    const onCloseModal = useCallback(() => history.push(ROUTES.MAIN), [history]);

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

                <NavLink to={ROUTES.LOGO}>
                    <img
                        className={styles.mainPage__image}
                        src="/favicon-32x32.png"
                        alt="React SSR Pack"
                    />
                </NavLink>

                {pathname === ROUTES.LOGO && (
                    <Modal onClose={onCloseModal}>
                        <NavLink
                            className={styles.mainPage__largeImageLink}
                            to={ROUTES.MAIN}
                        >
                            <img
                                className={styles.mainPage__largeImage}
                                src="/android-chrome-512x512.png"
                                alt="React SSR Pack"
                            />
                        </NavLink>
                    </Modal>
                )}
            </div>
        </HeadDataSwitchContainer>
    );
};

export default MainPage;
