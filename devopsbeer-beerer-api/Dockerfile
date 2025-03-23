FROM docker.io/node:23.9.0-alpine3.21@sha256:dc4d20572e425f9d4c68a6f9c382fbcfec3fa2f8ef0b12cb1d96feabdb479a48

WORKDIR /usr/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT [ "node", "dist/index.js" ]