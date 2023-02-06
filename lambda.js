// https://www.fastify.io/docs/latest/Guides/Serverless/#lambdajs

import awsLambdaFastify from '@fastify/aws-lambda';
const init = require('./app');

export const handler = awsLambdaFastify(init())
