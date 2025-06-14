FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .
COPY ./swagger.js ./dist

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]