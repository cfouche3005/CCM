FROM oven/bun:latest as pb-setup

RUN apk add wget unzip

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.18.10/pocketbase_0.18.10_linux_amd64.zip

RUN unzip pocketbase_0.18.10_linux_amd64.zip

FROM oven/bun:1-alpine as elysia-setup

COPY package.json .

RUN /usr/local/bin/bun install --production

FROM oven/bun:1-alpine as final

COPY src src
COPY tsconfig.json .
COPY .env .

COPY --from=elysia-setup /home/bun/app/package.json .
COPY --from=elysia-setup /home/bun/app/bun.lockb .
COPY --from=elysia-setup /home/bun/app/node_modules .

RUN mkdir /pocketbase
COPY --from=elysia-setup /home/bun/app/pocketbase ./pocketbase/

CMD pocketbase/pocketbase serve --http=0.0.0.0:8090 & bun run src/index.ts