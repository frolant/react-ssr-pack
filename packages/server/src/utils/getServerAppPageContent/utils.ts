import { resolve } from 'path';
import fs from 'fs';

import type { Request } from 'express';
import type { TRenderServerAppRequestOptions } from '../../types';

type TGetServerAppHTML = (head: string, content: string, bottom?: string) => string;

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

export const getServerAppHTML: TGetServerAppHTML = (head = '', content = '', bottom = '') => {
    return `${template.top}${head}${template.center}${container.start}${content}${container.end}${bottom}${template.bottom}`;
};

export const getRequestData = (request: Request): TRenderServerAppRequestOptions => {
    const { originalUrl, protocol, hostname, headers } = request;
    return {
        origin: `${protocol}://${headers.host}`,
        url: originalUrl,
        hostname,
        protocol
    };
};
