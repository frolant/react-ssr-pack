import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import type { IMenuItem } from 'store';

import styles from './Header.scss';

import type { FC } from 'react';

interface IProps {
    className: string;
    menu: IMenuItem[];
}

const Header: FC<IProps> = ({ className, menu }) => (
    <div className={classnames(className, styles.header)}>
        <div className={styles.header__container}>
            <NavLink
                className={styles.header__logo}
                to="/"
            >
                React SSR Pack
            </NavLink>

            <div className={styles.header__links}>
                {menu.map(({ title, link }) => (
                    <NavLink
                        key={link}
                        className={styles.header__link}
                        activeClassName={styles.header__link_active}
                        to={link}
                    >
                        {title}
                    </NavLink>
                ))}
            </div>

            <div className={styles.header__actions}>
                <a
                    className={classnames(styles.header__action)}
                    href="https://github.com/frolant/react-ssr-pack"
                    target="_blank"
                >
                    GitHub
                </a>
            </div>
        </div>
    </div>
);

export default Header;
