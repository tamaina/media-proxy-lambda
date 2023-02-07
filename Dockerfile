# https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/images-create.html#images-create-from-base
FROM public.ecr.aws/lambda/nodejs:18-arm64 as builder
WORKDIR /${LAMBDA_TASK_ROOT}

RUN yum install -y git
COPY package.json ${LAMBDA_TASK_ROOT}/
RUN npm install

FROM public.ecr.aws/lambda/nodejs:18-arm64 as runner
WORKDIR /${LAMBDA_TASK_ROOT}

COPY index.js app.js package.json ${LAMBDA_TASK_ROOT}/
COPY --from=builder ${LAMBDA_TASK_ROOT}/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]  
