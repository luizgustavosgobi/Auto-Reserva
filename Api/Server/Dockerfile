FROM node:21-slim

WORKDIR /api

COPY . .

RUN mkdir /var/ssl

RUN apt-get update -y && apt-get install -y openssl

RUN rm -rf node_modules
RUN npm install

RUN npm run build

CMD [ "npm", "start"]

EXPOSE 3000
