import superagent from 'superagent';

import type { Response } from 'superagent';

type TGetResponseBody = (response: Response) => any;
type TRequest = (url: string) => Promise<any>;

const getResponseBody: TGetResponseBody = (response) => response && response.body;

const request: TRequest = (url) => superagent.get(`${__HOST__}${url}`).then(getResponseBody);

export default request;
