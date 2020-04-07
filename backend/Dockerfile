FROM node:lts-slim

RUN mkdir -p /app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install --silent

EXPOSE 8080

COPY server.js /app/server.js
COPY src /app/src

CMD [ "nodemon", "server.js" ]