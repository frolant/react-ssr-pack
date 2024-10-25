import { resolve } from 'path';
import fs from 'fs';

import { stateAddressPart } from '../../constants';

import type { Request } from 'express';
import type { TRenderServerAppRequestOptions } from '../../types';

type TGetServerAppHTML = (originalUrl: string, head: string, content: string) => string;

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

export const getServerAppHTML: TGetServerAppHTML = (url = '', head = '', content = '') => {
    const headData = `${head}\r\n<script defer src="${stateAddressPart}${encodeURIComponent(url)}"></script>`;
    return `${template.top}${headData}${template.center}${container.start}${content}${container.end}${template.bottom}`;
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
