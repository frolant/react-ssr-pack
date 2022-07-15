import { resolve } from 'path';
import fs from 'fs';

type TGetServerAppHTML = (headData: any, contentData: string) => string;
type TGetProcessedHTMLTemplate = (head: string, content: string) => string;
type TGetProcessedContent = (contentData: string) => string;

const templatePath = resolve(__dirname, './template.html');
const titleRegexp = /<title>.*<\/title>/;
const container = {
    start: '<div id="root">',
    end: '</div>'
};

export const htmlTemplate = fs.readFileSync(templatePath, { encoding: 'utf-8' });

const templateProcessedHeadParts = htmlTemplate.split(titleRegexp);
const templateProcessedContentParts = templateProcessedHeadParts[1].split(`${container.start}${container.end}`);

const templateData = {
    top: templateProcessedHeadParts[0],
    center: templateProcessedContentParts[0],
    bottom: templateProcessedContentParts[1]
};

const getProcessedHTMLTemplate: TGetProcessedHTMLTemplate = (head, content) => {
    return `${templateData.top}${head}${templateData.center}${container.start}${content}${container.end}${templateData.bottom}`;
};

const getProcessedContent: TGetProcessedContent = (contentData = '') => {
    return contentData.replace(/<!-- -->/g, '');
};

const getProcessedHead: TGetProcessedContent = (headData = '') => {
    return headData.replace(/ data-rh="true"/g, '');
};

export const getServerAppHTML: TGetServerAppHTML = ({ helmet = {} }, contentData) => {
    const { title = '', meta = '' } = helmet;
    const head = getProcessedHead(`${title.toString()}${meta.toString()}`);
    const content = getProcessedContent(contentData);
    return getProcessedHTMLTemplate(head, content);
};
