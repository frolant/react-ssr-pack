import { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from 'components/Header';
import Footer from 'components/Footer';

import MainPage from 'pages/MainPage';

import { useAppSelector } from 'hooks/useAppSelector';

import { ROUTES } from 'constants/routes';

import styles from './App.scss';

import type { FC } from 'react';

const ContentPage = lazy(() => import('pages/ContentPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage'));

const App: FC = () => {
    const menuData = useAppSelector((state) => state.content.menu);

    return (
        <div className={styles.app}>
            <Header
                className={styles.app__header}
                menu={menuData}
            />

            <div className={styles.app__content}>
                <Switch>
                    <Route
                        path={[
                            ROUTES.MAIN,
                            ROUTES.LOGO
                        ]}
                        component={MainPage}
                        exact={true}
                    />

                    <Route
                        path={menuData.map((item) => item.link)}
                        component={ContentPage}
                        exact={true}
                    />

                    <Route
                        path={ROUTES.NOT_FOUND}
                        component={NotFoundPage}
                        exact={true}
                    />

                    <Redirect
                        path="*"
                        to={ROUTES.NOT_FOUND}
                    />
                </Switch>
            </div>

            <Footer
                className={styles.app__footer}
                menu={menuData}
            />
        </div>
    );
};

export default App;
