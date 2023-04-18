import React from 'react';
import parseHTML from 'html-react-parser';

interface IProps {
    contentRef?: HTMLElement;
}

const FallbackContent: React.FC<IProps> = ({ contentRef = {} }) => {
    const { innerHTML } = contentRef;
    return (
        <>
            {innerHTML ? parseHTML(innerHTML) : null}
        </>
    );
};

export default FallbackContent;
