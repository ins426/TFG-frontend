FROM node:18.12-alpine3.15

WORKDIR /usr/src/app

COPY package.json .

RUN npm cache clean --force
RUN npm i

COPY . .

EXPOSE 4200

CMD ["npm","start"]
