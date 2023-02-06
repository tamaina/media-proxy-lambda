// https://www.fastify.io/docs/latest/Guides/Serverless/#lambdajs

import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './app.js';

const proxy = awsLambdaFastify(init());
export const handler = proxy;
