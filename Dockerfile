FROM node:alpine AS BUILD

COPY . /tmp/src
RUN cd /tmp/src && npm install && npm run build

FROM node:alpine
ENV NODE_ENV=production
RUN mkdir -p /bot
WORKDIR /bot
COPY --from=BUILD /tmp/src/lib /bot/lib
COPY --from=BUILD /tmp/src/package*.json /bot/
RUN npm install --production
CMD node lib/index.js
VOLUME ["/data"]
