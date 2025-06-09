FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY ./backend .
COPY ./tsconfig.json .

RUN npm run build
RUN mkdir -p /var/log/speechsmith

EXPOSE 3001

CMD ["node", "./backend/index.js"]