type TChunksItem = Uint8Array;
type TChunks = TChunksItem[];

type TGetStringFromStream = (stream: any) => Promise<string>;
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

export const getStringFromPipeableStream: TGetStringFromStream = (stream) => {
    const chunks: TChunks = [];
    return new Promise((resolve) => {
        stream.pipe({
            ...writableStreamBypassPart,
            write: (chunk: TChunksItem) => chunks.push(processChunkHandler(chunk)),
            end: () => resolve(processResultHandler(chunks))
        });
    });
};
