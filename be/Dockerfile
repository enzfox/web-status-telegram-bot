FROM node:lts

WORKDIR /app

COPY . .

RUN npm ci --production

CMD ["npm", "run", "start"]
