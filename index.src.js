// https://www.fastify.io/docs/latest/Guides/Serverless/#lambdajs

import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './app.js';

const app = init();
const proxy = awsLambdaFastify(init());
export const handler = proxy;
await app.ready(); // https://github.com/fastify/aws-lambda-fastify#lower-cold-start-latency
