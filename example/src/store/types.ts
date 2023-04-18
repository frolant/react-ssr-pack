export enum EContentType {
    Lead = 'lead',
    Paragraph = 'paragraph'
}

export interface IContentItem {
    type: EContentType;
    value: string;
    link?: string;
}

export interface IPage {
    title: string;
    description: string;
    keywords: string;
    content: IContentItem[];
}

export interface IRequest {
    process: boolean;
    error: string | null;
}

export interface IPages {
    [key: string]: IPage;
}

export interface IMenuItem {
    title: string;
    link: string;
}

export interface IContent {
    pages: IPages | null;
    menu: IMenuItem[] | null;
}

export interface IRootReducer {
    request: IRequest;
    content: IContent;
}
