import { useCallback, useEffect } from 'react';
import classnames from 'classnames';

import Portal from '@react-ssr-pack/portal';

import { document } from 'utils/window';

import styles from './Modal.scss';

import type { FC, ReactNode } from 'react';

interface IModalProps {
    className?: string;
    children?: ReactNode;
    onClose?: () => void;
}

const Modal: FC<IModalProps> = ({
    className,
    children,
    onClose = (): void => {}
}) => {
    const onKeydownHandler = useCallback((event: any) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', onKeydownHandler);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeydownHandler);
            document.body.style.overflow = null;
        };
    }, [onKeydownHandler]);

    return (
        <Portal>
            <div className={classnames(styles.modal, className)}>
                <div
                    className={classnames(styles.modal__mask)}
                    role="presentation"
                    onClick={onClose}
                />

                <div className={classnames(styles.modal__container)}>
                    <div className={styles.modal__content}>
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
