FROM oven/bun:1-alpine as pb-setup

RUN apk add wget unzip

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.19.0/pocketbase_0.19.0_linux_amd64.zip

RUN unzip pocketbase_0.19.0_linux_amd64.zip

FROM oven/bun:1-alpine as elysia-setup

COPY package.json .

RUN /usr/local/bin/bun install 

FROM oven/bun:1-alpine as final

COPY src src
COPY tsconfig.json .

COPY --from=elysia-setup /home/bun/app/package.json .
COPY --from=elysia-setup /home/bun/app/bun.lockb .
COPY --from=elysia-setup /home/bun/app/node_modules node_modules

RUN mkdir /pocketbase
COPY --from=pb-setup /home/bun/app/pocketbase ./pocketbase/

CMD pocketbase/pocketbase serve --http=0.0.0.0:$PB_PORT --encryptionEnv=PB_ENCRYPTION_KEY & /usr/local/bin/bun run /home/bun/app/src/index.ts