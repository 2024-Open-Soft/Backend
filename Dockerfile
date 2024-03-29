FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG CLI_DATABASE_URL=default

ARG CLI_JWT_SECRET=default

ENV DATABASE_URL=${CLI_DATABASE_URL}

ENV JWT_SECRET=${CLI_JWT_SECRET}

EXPOSE 3001


CMD [ "npm" ,"run","dev"]