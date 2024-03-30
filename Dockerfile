FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG CLI_DATABASE_URL=default

ARG CLI_JWT_SECRET=default

ARG CLI_PORT=default

ENV DATABASE_URL="${CLI_DATABASE_URL}"
ENV JWT_SECRET="${CLI_JWT_SECRET}"
ENV PORT="${CLI_PORT}"

RUN echo ${CLI_DATABASE_URL}
RUN echo ${JWT_SECRET}
RUN echo ${CLI_PORT}

EXPOSE 3001


CMD [ "npm" ,"run","dev"]