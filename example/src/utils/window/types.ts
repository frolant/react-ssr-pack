interface IDocumentBodyData extends Partial<Omit<Document['body'], 'classList | style'>> {
    style: any;
    classList: any;
}

export type INavigatorData = Partial<Navigator>;

export type ILocalStorageData = Partial<Storage>;

export interface IDocumentData extends Partial<Omit<Document, 'body' | 'head'>> {
    body?: IDocumentBodyData;
    head?: Partial<Document['head']>;
}

export interface IWindowData extends Partial<Omit<Window, 'document' | 'location' | 'navigator' | 'localStorage' | 'getComputedStyle'>> {
    document: IDocumentData;
    navigator: INavigatorData;
    location: Partial<Window['location']>;
    localStorage: ILocalStorageData;
    console: Partial<Console>;
    getComputedStyle: (element: any, pseudoElement?: string) => CSSStyleDeclaration;
    URL: any;
}
