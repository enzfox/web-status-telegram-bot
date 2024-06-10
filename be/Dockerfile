FROM node:lts

WORKDIR /app

COPY . .

RUN npm install -g typescript nodemon

RUN npm ci --production

CMD ["npm", "run", "start"]
