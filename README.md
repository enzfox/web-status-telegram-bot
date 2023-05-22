# Web Status Telegram Bot

Receive telegram bot message about your websites' status.

## Install

### Clone

```bash
git clone https://github.com/als698/web-status-telegram-bot.git
```

### Install dependencies

```bash
cd web-status-telegram-bot
npm install
```

### Config

```bash
cp .env.example .env
```

Edit .env with:
  - TELEGRAM_BOT_TOKEN [@BotFather](https://t.me/BotFather)  
  - TELEGRAM_CHAT_ID [@userinfobot](https://t.me/userinfobot)  
  - WEBSITES_URLS - your websites urls, comma separated (https://google.com,https://yahoo.com)

### Run

On server

```bash
node index.js
```

or using Docker
```bash
docker compose up -d 
```

## ToDo

 - [ ] NoSQL database