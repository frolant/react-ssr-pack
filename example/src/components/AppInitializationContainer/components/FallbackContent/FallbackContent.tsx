import parseHTML from 'html-react-parser';

import type { FC } from 'react';

interface IProps {
    contentRef: HTMLElement;
}

const FallbackContent: FC<IProps> = ({ contentRef = {} as HTMLElement }) => {
    const { innerHTML } = contentRef;
    return (
        <>
            {innerHTML ? parseHTML(innerHTML) : null}
        </>
    );
};

export default FallbackContent;
