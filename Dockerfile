# stage 1 building the code

FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY --chown=node:node ./yarn*.json ./

RUN apk add --no-cache curl
RUN apk add --no-cache redis
RUN rm -rf node_modules && yarn

COPY --chown=node:node . .

EXPOSE 3000

USER node

CMD yarn run start:dev
