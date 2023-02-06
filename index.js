// https://www.fastify.io/docs/latest/Guides/Serverless/#lambdajs

import awsLambdaFastify from '@fastify/aws-lambda';
const init = require('./app');

const proxy = awsLambdaFastify(init());
export const handler = (event, context, callback) => proxy(event, context, callback);
