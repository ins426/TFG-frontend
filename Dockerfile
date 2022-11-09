FROM node:18.12-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 4200

CMD ["npm","start"]
