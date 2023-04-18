declare module '*.json' {
    const json: any;
    export = json;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.png' {
    const url: string;
    export = url;
}

declare module '*.scss' {
    const styles: {
        [className: string]: string;
    };
    export default styles;
}

interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
}
