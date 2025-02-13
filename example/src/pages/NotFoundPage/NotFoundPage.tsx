import HeadDataSwitchContainer from 'components/HeadDataSwitchContainer';

import { pageData } from './constants';

import styles from './NotFoundPage.scss';

import type { FC } from 'react';

const NotFoundPage: FC = () => (
    <HeadDataSwitchContainer
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
    >
        <div className={styles.notFoundPage}>
            <h1>
                {pageData.title}
            </h1>

            <p>
                {pageData.content}
            </p>
        </div>
    </HeadDataSwitchContainer>
);

export default NotFoundPage;
