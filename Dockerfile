FROM node:18.16

WORKDIR /app

COPY . .

RUN npm ci --production

CMD ["node", "index.js"]
