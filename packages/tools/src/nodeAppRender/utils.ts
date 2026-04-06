// @ts-ignore - REMOVE AFTER UPDATE TYPES FOR REACT 18
import { renderToPipeableStream } from 'react-dom/server';

import type { ReactElement } from 'react';

type TChunksItem = Uint8Array;
type TChunks = TChunksItem[];

type TGetStringFromComponent = (Component: ReactElement) => Promise<string>;
type TProcessChunkHandler = (chunk: TChunksItem) => Buffer;
type TResultChunkHandler = (chunks: TChunks) => string;

const processChunkHandler: TProcessChunkHandler = (chunk) => Buffer.from(chunk);
const processResultHandler: TResultChunkHandler = (chunks) => Buffer.concat(chunks).toString('utf8');

const bypassHandler = (): void => {};

const writableStreamBypassPart = {
    on: bypassHandler,
    cork: bypassHandler,
    destroy: bypassHandler
};

export const getStringFromComponent: TGetStringFromComponent = (App) => {
    const chunks: TChunks = [];

    return new Promise((resolve, reject) => {
        const writableStream: any = {
            ...writableStreamBypassPart,
            write: (chunk: TChunksItem) => chunks.push(processChunkHandler(chunk)),
            end: () => resolve(processResultHandler(chunks))
        };

        const { pipe } = renderToPipeableStream(App, {
            onAllReady: () => {
                pipe(writableStream);
            },
            onError: (error: unknown) => reject(error as Error)
        });
    });
};
