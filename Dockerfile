FROM node:alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install
# ADD ./ ./

CMD [ "node", "server" ]
