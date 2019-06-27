FROM node:10-jessie-slim
WORKDIR /app

COPY package.json .

COPY . .

RUN yarn install
RUN cd packages/app && yarn build

RUN yarn global add serve

CMD ["serve", "-s", "-l", "$PORT", "./packages/app/build"]
