// https://www.fastify.io/docs/latest/Guides/Serverless/#lambdajs

import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './app.js';

const app = init();
const proxy = awsLambdaFastify(init({
	enforceBase64: res => {
		const contentEncoding = res.headers['content-encoding'] || res.headers['Content-Encoding'];
		const type = res.headers['content-type'] || res.headers['Content-Type'] || '';

		if (type.includes('text') || type.includes('application/json') || type.includes('applicaton/xml') || type.includes('image/svg')) {
			// https://github.com/fastify/aws-lambda-fastify/blob/28260062905fbb477f0bf4454eb6be0103e1fb57/index.js#L3
			if (typeof contentEncoding === 'string' && contentEncoding === 'identity') {
				return false;
			}
		}

		return true;
	},
}));

export const handler = proxy;
await app.ready(); // https://github.com/fastify/aws-lambda-fastify#lower-cold-start-latency
