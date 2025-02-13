import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import styles from './Footer.scss';

import type { FC } from 'react';
import type { IMenuItem } from 'store';

interface IProps {
    className: string;
    menu: IMenuItem[];
}

const Footer: FC<IProps> = ({ className, menu }) => (
    <div className={classnames(className, styles.footer)}>
        <div className={styles.footer__container}>
            <div className={styles.footer__links}>
                {menu.map(({ title, link }) => (
                    <NavLink
                        key={link}
                        className={styles.footer__link}
                        activeClassName={styles.footer__link_active}
                        to={link}
                    >
                        {title}
                    </NavLink>
                ))}
            </div>

            <div className={styles.footer__copyright}>
                Copyright © 2022-{new Date().getFullYear()}

                <a
                    className={classnames(styles.footer__link, styles.footer__copyright_author)}
                    href="https://github.com/frolant"
                    target="_blank"
                >
                    Anton Frolov
                </a>
            </div>
        </div>
    </div>
);

export default Footer;
