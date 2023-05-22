FROM node:lts

WORKDIR /app

COPY . .

RUN npm ci --production

CMD ["node", "index.js"]
