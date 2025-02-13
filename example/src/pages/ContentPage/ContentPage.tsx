import classnames from 'classnames';

import HeadDataSwitchContainer from 'components/HeadDataSwitchContainer';

import { usePageData } from './hooks';

import { EContentType } from 'store';

import styles from './ContentPage.scss';

import type { FC } from 'react';

const ContentPage: FC = () => {
    const pageData = usePageData();

    return (
        <HeadDataSwitchContainer
            title={pageData.title}
            description={pageData.description}
            keywords={pageData.keywords}
        >
            <div className={styles.contentPage}>
                <h1>
                    {pageData.title}
                </h1>

                {pageData.content?.map(({ type, value, link }, key) => (
                    <p
                        key={key}
                        className={classnames({
                            [styles.contentPage__leadParagraph]: type === EContentType.Lead
                        })}
                    >
                        {link ? (
                            <a
                                key={key}
                                href={link}
                                target="_blank"
                            >
                                {value}
                            </a>
                        ) : value}
                    </p>
                ))}
            </div>
        </HeadDataSwitchContainer>
    );
};

export default ContentPage;
