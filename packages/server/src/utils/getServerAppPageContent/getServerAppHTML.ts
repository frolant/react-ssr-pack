import { resolve } from 'path';
import fs from 'fs';

type TGetServerAppHTML = (head: string, content: string) => string;
type TGetProcessedHTMLTemplate = (head: string, content: string) => string;
type TGetProcessedContent = (content: string) => string;

const templatePath = resolve(__dirname, './template.html');
const titleRegexp = /<title>.*<\/title>/;
const container = {
    start: '<div id="root">',
    end: '</div>'
};

export const htmlTemplate = fs.readFileSync(templatePath, {
    encoding: 'utf-8'
});

const templateProcessedHeadParts = htmlTemplate.split(titleRegexp);
const templateProcessedContentParts = templateProcessedHeadParts[1].split(`${container.start}${container.end}`);

const template = {
    top: templateProcessedHeadParts[0],
    center: templateProcessedContentParts[0],
    bottom: templateProcessedContentParts[1]
};

const getProcessedHTMLTemplate: TGetProcessedHTMLTemplate = (head, content) => {
    return `${template.top}${head}${template.center}${container.start}${content}${container.end}${template.bottom}`;
};

const getProcessedContent: TGetProcessedContent = (content = '') => {
    return content.replace(/<!-- -->/g, '');
};

export const getServerAppHTML: TGetServerAppHTML = (head = '', content = '') => {
    const processedContent = getProcessedContent(content);
    return getProcessedHTMLTemplate(head, processedContent);
};
